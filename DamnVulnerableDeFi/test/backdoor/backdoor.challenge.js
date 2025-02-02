const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Backdoor', function () {
    let deployer, users, attacker;

    const AMOUNT_TOKENS_DISTRIBUTED = ethers.utils.parseEther('40');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, alice, bob, charlie, david, attacker] = await ethers.getSigners();
        users = [alice.address, bob.address, charlie.address, david.address]

        // Deploy Gnosis Safe master copy and factory contracts
        this.masterCopy = await (await ethers.getContractFactory('GnosisSafe', deployer)).deploy();
        this.walletFactory = await (await ethers.getContractFactory('GnosisSafeProxyFactory', deployer)).deploy();
        this.token = await (await ethers.getContractFactory('DamnValuableToken', deployer)).deploy();
        
        // Deploy the registry
        this.walletRegistry = await (await ethers.getContractFactory('WalletRegistry', deployer)).deploy(
            this.masterCopy.address,
            this.walletFactory.address,
            this.token.address,
            users
        );

        // Users are registered as beneficiaries
        for (let i = 0; i < users.length; i++) {
            expect(
                await this.walletRegistry.beneficiaries(users[i])
            ).to.be.true;            
        }

        // Transfer tokens to be distributed to the registry
        await this.token.transfer(this.walletRegistry.address, AMOUNT_TOKENS_DISTRIBUTED);
    });

    it('Exploit', async function () {
        /** CODE YOUR EXPLOIT HERE */

        // Initial code reading notes:
        // - MAX_THRESHOLD constant is set to 1, is this the number of signatures required to approve a multisig tx? If so, that's a vuln
        // I can trigger the proxyCreated callback by creating a new proxy in the GnosisSafe [`this.walletFactory#createProxyWithCallback()`]
        // I should check out the GnosisSafe smart contract

        // One quick thought was that I could create a wallet with multiple owners (ie. a legit owner first, then also me) - however it seems
        // there is a guard against that with the MAX_OWNERS constant being 1

        // There's the setup call here for a new Safe https://github.com/safe-global/safe-contracts/blob/main/contracts/GnosisSafe.sol#L75
        // Maybe there are some clues:
        // `to` param - could I set my attacker address as the this? What is it used for?
        // `paymentReceiver` param - could I set my attacker address to this? What is it used for?
        // `fallbackHandler` param - could I give the wallet a fallback func that pays any incoming transfers on into my attacker address?
            // So this param is actually an address
        // Can I pass arbitrary code to the new wallet to execute as an initialiser? Could I give myself approval to the 10 DVT tokens it gets sent?

        // Ok looks like fallbackHandler isn't what I need, according to GnosisSafe proxy docs here https://github.com/safe-global/safe-contracts/blob/main/contracts/GnosisSafe.sol#L69
        // I actually need `to` and `data` params in order to execute some arbitrary code

        // I'm gonna have to do a quick crash course at getting better at encoding function calls hahah :')

        // So basically what will happen is:
        // My malicious contract creates the new wallet on behalf of the whitelisted beneficiary
        // All setup params are correct, the beneficiary will own the wallet as expected etc
        // However we also pass an exploitative encoded function call as a param that GnosisSafe::setup will call as part of wallet initialisation
        // This exploit function will be executed by the new wallet and cause it to give an ERC20 allowance to my malicious contract
        // After wallet creation, the WalletRegistry::proxyCreated callback is triggered, confirming it as created & transferring 10DVT to the wallet
        // My malicious contract will then use our allowance to send my attacker address the freshly arrived 10 DVT tokens!
        // We repeat for each of the 4 beneficiaries and there we go! 

        // SOLUTION ===========================================================

        const BackdoorAttackFactory = await ethers.getContractFactory('BackdoorAttack', attacker);
        this.attackContract = await BackdoorAttackFactory.connect(attacker).deploy(
            this.walletFactory.address,
            this.masterCopy.address,
            this.walletRegistry.address,
            this.token.address,
        );

        await this.attackContract.connect(attacker).triggerAttack(users);

        // LESSONS LEARNED ====================================================
        // Jesus this one was hard...
        // So let me get this straight, an organisation set up a resgistry of whitelisted addresses who could register GnosisSafe wallets 
        // They did 'the right thing' and integrated tightly with Gnosis with a ton of guards & checks
        // The thing that tripped them up was this GnosisSafe::setup function taking an arbitrary optional delegated call...
        // Just shows, even if it's a well established set of smart contracts you're integrating, you have to read & understand their source code
        // very well because it looks quite innocent at first glance

        // Could they have added access control to their instance of GnosisSafeProxyFactory to prevent this? 
        // ie. so that only the whitelisted beneficiaries could create the wallets in the first place

        // Ultimately, arbitrary code execution in an unexpected context was the root cause of this again
        // You must be ruthlessly strict in analysing where arbitrary code execution could take place and what the context could be

        // Side note, it was also very difficult to instrospect & debug what was going wrong with the param payloads I was 
        // sending to the Gnosis contracts due to their use of assembly code 
        // (and hence no decriptive revert strings, possibly due to https://github.com/NethermindEth/nethermind/issues/3207 ?)

        // Side note #2, I need some more practice encoding & passing functions and getting an instinct for what context the function will be 
        // executed in

        // TODO1 - after being heavily worked on, my BackdoorAttack.sol contract probably needs a bit of cleanup & refactoring, I will return here!

    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        for (let i = 0; i < users.length; i++) {
            let wallet = await this.walletRegistry.wallets(users[i]);
            
            // User must have registered a wallet
            expect(wallet).to.not.eq(ethers.constants.AddressZero, "User did not register a wallet");

            // User is no longer registered as a beneficiary
            expect(
                await this.walletRegistry.beneficiaries(users[i])
            ).to.be.false;
        }

        // Attacker must have taken all tokens
        expect(
            await this.token.balanceOf(attacker.address)
        ).to.eq(AMOUNT_TOKENS_DISTRIBUTED);
    });
});
