const { expect, assert } = require("chai");
const { ethers, waffle } = require("hardhat");
const { keccak256 } = require('@ethersproject/solidity')


describe("Mutants", function () {
  this.timeout(20000)

  const mutantId = 1337;
  const backgroundTokenId = 42;

  const backgroundType = 1;
  const imageType = 2;

  let admin, alice, bob, charlie;

  async function deploy(contractName, ...args) {
    const Factory = await ethers.getContractFactory(contractName, admin)
    const instance = await Factory.deploy(...args)
    return instance.deployed()
  }

  it("Integration", async function () {
    [admin, alice, bob, charlie] = await ethers.getSigners();

    const mutantFactory = await deploy("MutantFactory");

    // Create mutant
    let tx = await mutantFactory.connect(alice).createMutant(bob.address, mutantId);
    let receipt = await tx.wait();
    const mutantCreatedEvent = receipt.events.find((x) => {
        return x.event == "MutantCreated";
    });
    const mutantAddress = mutantCreatedEvent.args.mutant;
    assert.equal(mutantCreatedEvent.args.tokenId, mutantId);

    const Mutant = await ethers.getContractFactory("Mutant");
    const mutant = new ethers.Contract(mutantAddress, Mutant.interface, admin);

    assert.equal(await mutant.getOwner(), bob.address);

    // Deploy images ERC721, mint background nft, approve it for mutant
    const images = await deploy("ImagesNFT");
    await images.mint(charlie.address, backgroundTokenId);
    await images.connect(charlie).approve(mutantAddress, backgroundTokenId);

    // Mutate with background
    await mutant.connect(bob).mutate(backgroundType, images.address, backgroundTokenId);
    assert.equal(await images.ownerOf(backgroundTokenId), mutantAddress);
  })
})
