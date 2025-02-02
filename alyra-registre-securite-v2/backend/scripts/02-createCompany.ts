import { ethers } from "hardhat"

async function main() {
  const SecurityRegister = await ethers.deployContract("SecurityRegister")
  await SecurityRegister.waitForDeployment()
  const latestBlock = await ethers.provider.getBlock("latest")

  console.log(`SecurityRegister deployed to ${SecurityRegister.target} at block ${latestBlock?.number}`)

  const [
    owner,
    comp1,
    comp2,
    compAcc1,
    compAcc2,
    compAcc3,
    compAcc4,
    ver1,
    ver2,
    verAcc1,
    verAcc2,
    verAcc3,
    acc12,
  ] = await ethers.getSigners()


  // Create companies
  // company 1 + 2 sites = 3
  await SecurityRegister.connect(comp1)
      .createRegister("Wood", "800 Ohio Rd.Woodhaven, NY 11421", "123456", "Ohio 1", "800 Ohio Rd.Woodhaven, NY 11421")
  await SecurityRegister.connect(comp1)
      .createRegister("Wood", "800 Ohio Rd.Woodhaven, NY 11421", "123456", "Ohio 2", "802 Ohio Rd.Woodhaven, NY 11421")
  await SecurityRegister.connect(comp1)
      .createRegister("Wood", "800 Ohio Rd.Woodhaven, NY 11421", "123456", "Park 888", "888 Beacon Ave. Villa Park, IL 60181")

  // company 2
  await SecurityRegister.connect(comp2)
      .createRegister("Red", "737 Redwood St.Branford, CT 06405", "98765", "ABC", "737 Redwood St.Branford, CT 06405")

  // Add company accounts
  // company 1 + 3 accounts = 4
  await SecurityRegister.connect(comp1).updateCompanyAccount(compAcc1, "Arnaud", "Séné", "add")
  await SecurityRegister.connect(comp1).updateCompanyAccount(compAcc2, "Anthony", "Marek", "add")
  await SecurityRegister.connect(comp1).updateCompanyAccount(compAcc3, "Vince", "Schtout", "add")
  // company 2 + 1 account = 2
  await SecurityRegister.connect(comp2).updateCompanyAccount(compAcc4, "Peter", "Rockenback", "add")


  // Create verifiers
  // verifier 1
  await SecurityRegister.connect(ver1)
      .createVerifier("AVGP 1", "797 Newcastle Street Fuquay Varina, NC 27526", "121212", "#456987")
  // verifier 2
  await SecurityRegister.connect(ver2)
      .createVerifier("AVGP 777", "43 Bedford Dr. Nanuet, NY 10954", "900900", "#434241")

  // Add account to verifier
  // verifier 1 + 2 accounts = 3
  await SecurityRegister.connect(ver1).updateVerifierAccount(verAcc1, "Verifier1", "NumABC", "add")
  await SecurityRegister.connect(ver1).updateVerifierAccount(verAcc2, "Verifier2", "NumDEF", "add")
  // verifier 2 + 1 account = 2
  await SecurityRegister.connect(ver2).updateVerifierAccount(verAcc3, "Verifier3", "NumGHI", "add")


  // Assigned a verifier to a company
  // company 1 add verifier 1
  await SecurityRegister.connect(comp1).addVerifierToCompany(ver1)
  // company 2 add verifier 2
  await SecurityRegister.connect(comp2).addVerifierToCompany(ver2)


  // Create verification tasks
  // company 1 add 1 task
  await SecurityRegister.connect(comp1).createVerificationTask("Ohio 1", "extincteur", 6)
  await SecurityRegister.connect(comp1).createVerificationTask("Ohio 1", "tableau electrique", 5)
  await SecurityRegister.connect(comp1).createVerificationTask("Ohio 1", "ascenseur", 2)
  await SecurityRegister.connect(comp1).createVerificationTask("Ohio 2", "extincteur", 6)
  await SecurityRegister.connect(comp1).createVerificationTask("Ohio 2", "tableau electrique", 5)
  // company 2 add 1 task
  await SecurityRegister.connect(comp2).createVerificationTask("ABC", "extincteur", 6)
  // company 1 add 1 task with delegated company account 1
  await SecurityRegister.connect(compAcc1).createVerificationTask("Ohio 2", "Ascenseur", 2)
  // company 2 add 1 task with delegated company account 1
  await SecurityRegister.connect(compAcc4).createVerificationTask("ABC", "Ascenseur", 2)


  // Read
  // check company account
  const isCompany1 = await SecurityRegister.isCompany(comp1)
  console.log("Is "+ comp1.address +" a company account? => " + isCompany1)

  const isCompany2 = await SecurityRegister.isCompany(comp2)
  console.log("Is "+ comp2.address +" a company account? => " + isCompany2)
  // check delegated company account
  const isDelegatedCompany1 = await SecurityRegister.isCompanyAccount(compAcc1)
  console.log("Is "+ compAcc1.address +" a delegated company account? => " + isDelegatedCompany1)

  const isDelegatedCompany2 = await SecurityRegister.isCompanyAccount(compAcc2)
  console.log("Is "+ compAcc2.address +" a delegated company account? => " + isDelegatedCompany2)

  const isDelegatedCompany3 = await SecurityRegister.isCompanyAccount(compAcc3)
  console.log("Is "+ compAcc3.address +" a delegated company account? => " + isDelegatedCompany3)

  // check verifier account
  const isVerifier1 = await SecurityRegister.isVerifier(ver1)
  console.log("Is "+ ver1.address +" a verifier account? => " + isVerifier1)

  const isVerifier2 = await SecurityRegister.isVerifier(ver2)
  console.log("Is "+ ver2.address +" a verifier account? => " + isVerifier2)

  // check delegated verifier account
  const isDelegatedVerifier1 = await SecurityRegister.isVerifierAccount(verAcc1)
  console.log("Is "+ verAcc1.address +" a delegated verifier account? => " + isDelegatedVerifier1)

  const isDelegatedVerifier2 = await SecurityRegister.isVerifierAccount(verAcc2)
  console.log("Is "+ verAcc2.address +" a delegated verifier account? => " + isDelegatedVerifier2)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
