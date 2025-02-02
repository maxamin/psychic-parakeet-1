const { ethers, upgrades } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Climber', function () {
    let deployer, proposer, sweeper, attacker;

    // Vault starts with 10 million tokens
    const VAULT_TOKEN_BALANCE = ethers.utils.parseEther('10000000');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, proposer, sweeper, attacker] = await ethers.getSigners();

        await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0x16345785d8a0000", // 0.1 ETH
        ]);
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.equal(ethers.utils.parseEther('0.1'));
        
        // Deploy the vault behind a proxy using the UUPS pattern,
        // passing the necessary addresses for the `ClimberVault::initialize(address,address,address)` function
        this.vault = await upgrades.deployProxy(
            await ethers.getContractFactory('ClimberVault', deployer),
            [ deployer.address, proposer.address, sweeper.address ],
            { kind: 'uups' }
        );

        expect(await this.vault.getSweeper()).to.eq(sweeper.address);
        expect(await this.vault.getLastWithdrawalTimestamp()).to.be.gt('0');
        expect(await this.vault.owner()).to.not.eq(ethers.constants.AddressZero);
        expect(await this.vault.owner()).to.not.eq(deployer.address);
        
        // Instantiate timelock
        let timelockAddress = await this.vault.owner();
        this.timelock = await (
            await ethers.getContractFactory('ClimberTimelock', deployer)
        ).attach(timelockAddress);
        
        // Ensure timelock roles are correctly initialized
        expect(
            await this.timelock.hasRole(await this.timelock.PROPOSER_ROLE(), proposer.address)
        ).to.be.true;
        expect(
            await this.timelock.hasRole(await this.timelock.ADMIN_ROLE(), deployer.address)
        ).to.be.true;

        // Deploy token and transfer initial token balance to the vault
        this.token = await (await ethers.getContractFactory('DamnValuableToken', deployer)).deploy();
        await this.token.transfer(this.vault.address, VAULT_TOKEN_BALANCE);
    });

    it('Exploit', async function () {        
        /** CODE YOUR EXPLOIT HERE */

        // Initial thoughts: ok so the timelock is setup as part of ClimberVault::initialize
        // Any chance I could upgrade the vault and set myself as the owner/proposer somehow?
        // Only the sweeper role is allowed to call ClimberVault::sweepFunds
        // If I can force a contract upgrade through with my address as the 'sweeper' param then I would have access

        // With the UUPS proxy pattern the upgradeable machinery is stored in the implementation (rather than the proxy a la the transparent pattern)
            // https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/tree/master/contracts/proxy
            // Inheriting from OZ's UUPSUpgradeable contract is what provides the upgradeable machinery
            // Along with overriding _authorizeUpgrade() for setting a relevant access control mechanism

        // In our case, only the Timelock can make upgrades
        // So I have to force the Timelock to execute a proposal to upgrade the contract with my attacker address as the sweeper param (pray for me)
        // However only the proposer role can schedule new actions to execute
        // The only entry point I have anywhere is ClimberTimelock::execute so I guess I start here, even though there are no operations currently scheduled
        // Line 105 where I can call an arbitrary function seems interesting
        // Especially considering the only thing I have to do to make it pass is ensure  ```require(getOperationState(id) == OperationState.ReadyForExecution);```
        // If I could reverse engineer how to make that work, oh wait I believe that function needs the action to be scheduled
        // What context would the func on line 105 be executed in?
        // If the context is the Timelock itself, what would that open up? 
            // I could updateDelay()
            // The Timelock doesn't have role of proposer, only admin
            // What other things can an admin role do? I should check out OZ Access Control
            // Wait, what is _setRoleAdmin()? Could I call that with the Timelock as context (which is an admin) and add myself as a proposer or something?
            // Or maybe I could just call _setupRole() and give myself the proposer role? 

        // How the hell do you call this OpenZeppelin::Address::functionCallWithValue lol??
        // https://docs.openzeppelin.com/contracts/3.x/api/utils#Address-functionCall-address-bytes-

        // Crucially, they have the require guard on 108 after the external calls (violating checks-effects-interaction), allowing me to make my arbitrary calls 
        // My calls: 
            // 1) set delay to 0
            // 2) give myself proposer role
            // 4) Trigger an upgrade of the vault with my attacker contract as the sweeper role (or alternatively re-write sweep func to allow me to call it)
            // 4) Make a proposal to satisfy the require L108 statement (How do I satisfy this?)
        // Then I sweep the funds in the same tx then send them to my attacker EOA address

        // Ah, actually I need to create a new ClimberVaultV2 contract & deploy an instance of that to give me a new ::initialize to just give me sweeper role 
        // since I shouldn't re-run the whole original ::initialize

        // Ok! I'm confident I'm sweeping the funds now, last step is to create the proposal and make it pass the guard on L108 


        // SOLUTION ===========================================================
        const MaliciousVaultFactory = await ethers.getContractFactory('ClimberVaultV2', attacker);
        this.maliciousVault = await MaliciousVaultFactory.connect(attacker).deploy();
 

        const ClimberAttackFactory = await ethers.getContractFactory('ClimberAttack', attacker);
        this.attackContract = await ClimberAttackFactory.connect(attacker).deploy(
            this.timelock.address,
            this.vault.address,
            this.maliciousVault.address,
            this.token.address
        );

        await this.attackContract.connect(attacker).triggerAttack();
 
        // console.log("hmm:", await this.timelock.getOperationState(ethers.utils.formatBytes32String("0")));

        // LESSONS LEARNED ====================================================
        // Once again it seems like tighter access control could have been more beneficial here
        // For something that's clearly so organisationally driven, such as this timelock contract to control a vault, it seems preferable to whitelist who can call ::execute
        // Especially since that is where the arbitrary code execution comes from (even though there are checks in place to try ensure the actions were previously queued)

        // Holy crap I learned so much doing this challenge!! That was so fun!! 

    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(await this.token.balanceOf(this.vault.address)).to.eq('0');
        expect(await this.token.balanceOf(attacker.address)).to.eq(VAULT_TOKEN_BALANCE);
    });
});
