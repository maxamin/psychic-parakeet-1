import { ethers } from "hardhat"

async function main() {
  const SecurityRegister = await ethers.deployContract("SecurityRegister")
  await SecurityRegister.waitForDeployment()
  const latestBlock = await ethers.provider.getBlock("latest")

  console.log(`SecurityRegister deployed to ${SecurityRegister.target} at block ${latestBlock?.number}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
