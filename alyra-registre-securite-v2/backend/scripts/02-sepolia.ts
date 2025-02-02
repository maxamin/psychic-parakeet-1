import { Log } from "ethers";
import { ethers } from "hardhat"
import { ICompanyAccountUpdated, IRegisterCreated, IVerificationTaskCreated, IVerificationTaskUpdated, IVerificationTaskValidated, IVerifierAccountUpdated, IVerifierAddedToCompany, IVerifierCreated } from "./interfaces/events";
import { CompanyAccountUpdated, RegisterCreated, VerificationTaskCreated, VerificationTaskUpdated, VerificationTaskValidated, VerifierAccountUpdated, VerifierAddedToCompany, VerifierCreated } from "./events/events";

// Init provider
const hre = require("hardhat")
const alchemyUrl = hre.network.config.url
const provider = new ethers.JsonRpcProvider(alchemyUrl);

async function main() {
  console.log("alchemyUrl: " + alchemyUrl)
  console.log("contractAddress: " + process.env.CONTRACT_ADDRESS)
  console.log("GENESIS_BLOCK: " + Number(process.env.GENESIS_BLOCK))

  const registerCreated: IRegisterCreated[] = await getRegisterCreated()
  const companyAccountUpdated: ICompanyAccountUpdated[] = await getCompanyAccountUpdated()
  const verifierCreated: IVerifierCreated[] = await getVerifierCreated()
  const verifierAccountUpdated: IVerifierAccountUpdated[] = await getVerifierAccountUpdated()
  const verifierAddedToCompany: IVerifierAddedToCompany[] = await getVerifierAddedToCompany()
  const verificationTaskCreated: IVerificationTaskCreated[] = await getVerificationTaskCreated()
  const verificationTaskValidated: IVerificationTaskValidated[] = await getVerificationTaskValidated()
  const verificationTaskUpdated: IVerificationTaskUpdated[] = await getVerificationTaskUpdated()
}

async function getRegisterCreated(): Promise<IRegisterCreated[]> {
  console.log("Getting 'RegisterCreated' event logs ...")
  // Load deployed smart contract
  const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`
  const contractAbi = [RegisterCreated]
  const contract =  new ethers.Contract(contractAddress, contractAbi, provider);

  // Events
  const eventFilter = contract.filters.RegisterCreated()
  const fromBlock = Number(process.env.GENESIS_BLOCK)
  const toBlock = 'latest'
  const eventLogs = await contract.queryFilter(eventFilter, fromBlock, toBlock)
  console.log("Event log retrieved: #" + eventLogs.length)

  let logs: IRegisterCreated[] = []
  
  eventLogs.map((event: Log) => {

    // @ts-expect-error
    const eventLog = event.args

    const r: IRegisterCreated = {
      siteName: eventLog._siteName,
      siteAddressName: eventLog._siteAddressName,
      siret: eventLog._siret,
      name: eventLog._name,
      addressName: eventLog._addressName,
      addr: eventLog._addr
    }

    logs.push(r)
  })

  return logs
}

async function getCompanyAccountUpdated(): Promise<ICompanyAccountUpdated[]> {
  console.log("Getting 'CompanyAccountUpdated' event logs ...")
  // Load deployed smart contract
  const contractAddress: `0x${string}` = process.env.CONTRACT_ADDRESS as `0x${string}`
  const contractAbi = [CompanyAccountUpdated]
  const contract =  new ethers.Contract(contractAddress, contractAbi, provider);

  // Events
  const eventFilter = contract.filters.CompanyAccountUpdated()
  const fromBlock = BigInt(Number(process.env.GENESIS_BLOCK))
  const toBlock = 'latest'
  const eventLogs = await contract.queryFilter(eventFilter, fromBlock, toBlock)
  console.log("Event log retrieved: #" + eventLogs.length)

  let logs: ICompanyAccountUpdated[] = []

  eventLogs.map((event: Log) => {

    // @ts-expect-error
    const eventLog = event.args
    
    const r: ICompanyAccountUpdated = {
      company: eventLog._company,
      account: eventLog._account,
      name: eventLog._name,
      firstName: eventLog._firstName,
      action: eventLog._action
    }

    logs.push(r)
  })

  return logs
}

async function getVerifierCreated(): Promise<IVerifierCreated[]> {
  console.log("Getting 'VerifierCreated' event logs ...")
  // Load deployed smart contract
  const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`
  const contractAbi = [VerifierCreated]
  const contract =  new ethers.Contract(contractAddress, contractAbi, provider);

  // Events
  const eventFilter = contract.filters.VerifierCreated()
  const fromBlock = Number(process.env.GENESIS_BLOCK)
  const toBlock = 'latest'
  const eventLogs = await contract.queryFilter(eventFilter, fromBlock, toBlock)
  console.log("Event log retrieved: #" + eventLogs.length)

  let logs: IVerifierCreated[] = []
  
  eventLogs.map((event: Log) => {

    // @ts-expect-error
    const eventLog = event.args

    const r: IVerifierCreated = {
      verifier: eventLog._verifier, 
      name: eventLog._name, 
      addressName: eventLog._addressName,  
      siret: eventLog._siret,  
      approvalNumber: eventLog._approvalNumber, 
    }

    logs.push(r)
  })

  return logs
}

async function getVerifierAccountUpdated(): Promise<IVerifierAccountUpdated[]> {
  console.log("Getting 'VerifierAccountUpdated' event logs ...")
  // Load deployed smart contract
  const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`
  const contractAbi = [VerifierAccountUpdated]
  const contract =  new ethers.Contract(contractAddress, contractAbi, provider);

  // Events
  const eventFilter = contract.filters.VerifierAccountUpdated()
  const fromBlock = Number(process.env.GENESIS_BLOCK)
  const toBlock = 'latest'
  const eventLogs = await contract.queryFilter(eventFilter, fromBlock, toBlock)
  console.log("Event log retrieved: #" + eventLogs.length)

  let logs: IVerifierAccountUpdated[] = []
  
  eventLogs.map((event: Log) => {

    // @ts-expect-error
    const eventLog = event.args

    const r: IVerifierAccountUpdated = {
      verifier: eventLog._verifier,
      account: eventLog._account,
      name: eventLog._name,
      firstName: eventLog._firstName,
      action: eventLog._action,
    }

    logs.push(r)
  })

  return logs
}

async function getVerifierAddedToCompany(): Promise<IVerifierAddedToCompany[]> {
  console.log("Getting 'VerifierAddedToCompany' event logs ...")
  // Load deployed smart contract
  const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`
  const contractAbi = [VerifierAddedToCompany]
  const contract =  new ethers.Contract(contractAddress, contractAbi, provider);

  // Events
  const eventFilter = contract.filters.VerifierAddedToCompany()
  const fromBlock = Number(process.env.GENESIS_BLOCK)
  const toBlock = 'latest'
  const eventLogs = await contract.queryFilter(eventFilter, fromBlock, toBlock)
  console.log("Event log retrieved: #" + eventLogs.length)

  let logs: IVerifierAddedToCompany[] = []
  
  eventLogs.map((event: Log) => {

    // @ts-expect-error
    const eventLog = event.args

    const r: IVerifierAddedToCompany = {
      company: eventLog._company,
      verifier: eventLog._verifier,
    }

    logs.push(r)
  })

  return logs
}

async function getVerificationTaskCreated(): Promise<IVerificationTaskCreated[]> {
  console.log("Getting 'VerificationTaskCreated' event logs ...")
  // Load deployed smart contract
  const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`
  const contractAbi = [VerificationTaskCreated]
  const contract =  new ethers.Contract(contractAddress, contractAbi, provider);

  // Events
  const eventFilter = contract.filters.VerificationTaskCreated()
  const fromBlock = Number(process.env.GENESIS_BLOCK)
  const toBlock = 'latest'
  const eventLogs = await contract.queryFilter(eventFilter, fromBlock, toBlock)
  console.log("Event log retrieved: #" + eventLogs.length)

  let logs: IVerificationTaskCreated[] = []
  
  eventLogs.map((event: Log) => {

    // @ts-expect-error
    const eventLog = event.args

    const r: IVerificationTaskCreated = {
      company: eventLog._company,
      verifier: eventLog._verifier,
      registerId: eventLog._registerId,
      securityType: eventLog._securityType,
      taskId: eventLog._taskId,
      taskStatus: eventLog._taskStatus,
      siteName: eventLog._siteName,
      timestamp: eventLog._timestamp,
    }

    logs.push(r)
  })

  return logs
}

async function getVerificationTaskValidated(): Promise<IVerificationTaskValidated[]> {
  console.log("Getting 'VerificationTaskValidated' event logs ...")
  // Load deployed smart contract
  const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`
  const contractAbi = [VerificationTaskValidated]
  const contract =  new ethers.Contract(contractAddress, contractAbi, provider);

  // Events
  const eventFilter = contract.filters.VerificationTaskValidated()
  const fromBlock = Number(process.env.GENESIS_BLOCK)
  const toBlock = 'latest'
  const eventLogs = await contract.queryFilter(eventFilter, fromBlock, toBlock)
  console.log("Event log retrieved: #" + eventLogs.length)

  let logs: IVerificationTaskValidated[] = []
  
  eventLogs.map((event: Log) => {

    // @ts-expect-error
    const eventLog = event.args

    const r: IVerificationTaskValidated = {
      verifier: eventLog._verifier,
      taskId: eventLog._taskId,
      taskStatus: eventLog._taskStatus,
    }

    logs.push(r)
  })

  return logs
}

async function getVerificationTaskUpdated(): Promise<IVerificationTaskUpdated[]> {
  console.log("Getting 'VerificationTaskUpdated' event logs ...")
  // Load deployed smart contract
  const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`
  const contractAbi = [VerificationTaskUpdated]
  const contract =  new ethers.Contract(contractAddress, contractAbi, provider);

  // Events
  const eventFilter = contract.filters.VerificationTaskUpdated()
  const fromBlock = Number(process.env.GENESIS_BLOCK)
  const toBlock = 'latest'
  const eventLogs = await contract.queryFilter(eventFilter, fromBlock, toBlock)
  console.log("Event log retrieved: #" + eventLogs.length)

  let logs: IVerificationTaskUpdated[] = []
  
  eventLogs.map((event: Log) => {

    // @ts-expect-error
    const eventLog = event.args

    const r: IVerificationTaskUpdated = {
      company: eventLog.company,
      taskId: eventLog._taskId,
      taskStatus: eventLog._taskStatus,
    }

    logs.push(r)
  })

  return logs
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
