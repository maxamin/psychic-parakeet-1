import { ethers } from "hardhat"
import 'dotenv/config'

async function main() {
    // Deploy smart contract
    console.log("1. Deploy smart contract")
    const SecurityRegister = await ethers.deployContract("SecurityRegister")
    await SecurityRegister.waitForDeployment()
    const latestBlock = await ethers.provider.getBlock("latest")

    console.log(`\tSecurityRegister deployed to: ${SecurityRegister.target} at block: ${latestBlock?.number}`)

    // Define Sepolia account
    const sepolia = ethers.getDefaultProvider("https://endpoints.omniatech.io/v1/eth/sepolia/public\t")
    const verifier_pk = `${process.env.VERIFIER_PK}`
    const company_pk = `${process.env.COMPANY_PK}`
    const verifier = new ethers.Wallet(verifier_pk, sepolia)
    const company = new ethers.Wallet(company_pk, sepolia)

    console.log("\tcompany: " + company.address)
    console.log("\tverifier: " + verifier.address)




    // // Company
    // // Create companies
    // console.log("2. Company create company/sites")
    // await SecurityRegister.connect(company)
    //     .createRegister("Compagnie 1", "800 Ohio Rd.Woodhaven, NY 11421", "123456", "Ohio 1", "800 Ohio Rd.Woodhaven, NY 11421")
    // await SecurityRegister.connect(company)
    //     .createRegister("Compagnie 1", "800 Ohio Rd.Woodhaven, NY 11421", "123456", "Ohio 2", "802 Ohio Rd.Woodhaven, NY 11421")

    // // Company
    // // Add account
    // console.log("3. Company add account")
    // await SecurityRegister.connect(company).updateCompanyAccount(company, "McQueen", "Steve", "add")

    // // Verifier
    // // Create verifiers
    // console.log("4. Verifier create verifier")
    // await SecurityRegister.connect(verifier)
    //     .createVerifier("Verifier 1", "797 Newcastle Street Fuquay Varina, NC 27526", "121212", "456987")

    // // Verifier
    // // Add account to verifier
    // console.log("5. Verifier add account")
    // await SecurityRegister.connect(verifier).updateVerifierAccount(verifier, "Smith", "John", "add")


    // // Company
    // // Assigned a verifier to a company
    // console.log("6. Company assign his verifier")
    // await SecurityRegister.connect(company).addVerifierToCompany(verifier)

    // // Company
    // // Create verification tasks
    // // site 1
    // console.log("7. Company create verification tasks")
    // await SecurityRegister.connect(company).createVerificationTask("Ohio 1", "extincteur", 6)
    // await SecurityRegister.connect(company).createVerificationTask("Ohio 1", "tableau electrique", 5)
    // await SecurityRegister.connect(company).createVerificationTask("Ohio 1", "ascenseur", 2)
    // // site 2
    // await SecurityRegister.connect(company).createVerificationTask("Ohio 2", "extincteur", 6)
    // await SecurityRegister.connect(company).createVerificationTask("Ohio 2", "tableau electrique", 5)


    // // Verifier
    // // Validate verification tasks
    // console.log("8. Verifier validates verification tasks")
    // await SecurityRegister.connect(verifier).validateVerificationTask(0)
    // await SecurityRegister.connect(verifier).validateVerificationTask(1)
    // await SecurityRegister.connect(verifier).validateVerificationTask(3)

    // // Company
    // // Approve taskId 0
    // // Approve with  taskId 0
    // // Approve taskId 0
    // console.log("9. Company updates tasks")
    // await SecurityRegister.connect(company).updateVerificationTask(0, 'approve')
    // await SecurityRegister.connect(company).updateVerificationTask(1, 'reject')
    // await SecurityRegister.connect(company).updateVerificationTask(3, 'approveWithReservation')

    // // Company
    // // Mint token
    // // Mint approve and rejected only
    // console.log("10. Company mint tokens")
    // const tokenURI0: string = "https://ipfs.io/ipfs/QmRgcWjmwXKffCHNu1NmQzvLU7uq6zhu4scZhWJ9shEFJg/0.json"
    // const tokenURI1: string = "https://ipfs.io/ipfs/Qme7cv7v5F1VrqGziBEeVmXotfYMe7UnJ8dZ1VVVEcGF2N/1.json"

    // await SecurityRegister.connect(company).safeMint(0, tokenURI0)
    // await SecurityRegister.connect(company).safeMint(1, tokenURI1)

    // // Verify token
    // console.log("11. Verify token URIs")
    // const verifyToken0 = await SecurityRegister.tokenURI(0)
    // const verifyToken1 = await SecurityRegister.tokenURI(1)

    // console.log("\ttoken 0: " + verifyToken0)
    // console.log("\ttoken 1: " + verifyToken1)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
