import 'dotenv/config'
import {
    BaseError,
    ContractFunctionRevertedError,
    createPublicClient,
    GetLogsReturnType,
    http,
    HttpTransport,
    parseAbiItem
} from "viem"
import { hardhat, sepolia } from "viem/chains"
import { readContract, prepareWriteContract, writeContract } from "@wagmi/core"
import { 
    CompanyAccountUpdatedsDocument, RegisterCreatedsDocument, 
    VerificationTaskCreatedsDocument, VerificationTaskUpdatedsDocument, 
    VerificationTaskValidatedsDocument, VerifierAccountUpdatedsDocument, 
    VerifierAddedToCompaniesDocument, VerifierCreatedsDocument,
    execute,
    VerificationTaskCreatedsByCompanyDocument,
    VerificationTaskCreatedsByVerifierDocument
} from '@/.graphclient'
import { abi, contractAddress, genesisBlock, httpTransport, network } from "@/constants"
import {
    CompanyAccountUpdated,
    RegisterCreated,
    VerificationTaskCreated,
    VerificationTaskUpdated,
    VerificationTaskValidated,
    VerifierAccountUpdated,
    VerifierAddedToCompany,
    VerifierCreated
} from "@/constants/events"
import {
    ICompanyAccountUpdated,
    IRegisters,
    IRegisterCreated,
    ICompanyProfile
} from "@/interfaces/registers"
import { IVerifierAddedToCompany } from "@/interfaces/verifier"
import { IVerifierAccountUpdated, IVerifierCreated, IVerifierProfile } from "@/interfaces/verifier"
import {
    IVerificationTaskCreated,
    IVerificationTaskUpdated, IVerificationTaskValidated
} from "@/interfaces/verificationTasks"
import { RegisterVerificationId } from "@/constants/enums"


const usedNetwork = () => {
    switch (network) {
        case 'sepolia': return sepolia
        case 'hardhat': return hardhat
    }
}

const useHttp = (): HttpTransport => {
    switch (network) {
        case 'sepolia': return http(httpTransport)
        case 'hardhat': return http()
        default: return http()
    }
}
export const client = createPublicClient({
    chain: usedNetwork(),
    transport: useHttp()
})


export const readContractByFunctionName = async <T>(
    functionName: string,
    address: `0x${string}`,
    ...args: `0x${string}`[]|any[]
): Promise<T> => {

    try {
        const data: Promise<T>|unknown = await readContract({
            address: contractAddress,
            abi: abi,
            functionName: functionName,
            account: address,
            args: args
        })

        return data as T
    } catch (err) {
        throw formattedError(err)
    }
}

export const writeContractByFunctionName = async (
    functionName: string,
    ...args: `0x${string}`[]|any[]
): Promise<`0x${string}`> => {
    try {
        const { request } = await prepareWriteContract({
            address: contractAddress,
            abi: abi,
            functionName: functionName,
            args: args
        })

        const { hash } = await writeContract(request)
        
        return hash
    } catch (err) {
        throw formattedError(err)
    }
}


export const readEvents = async (signature: string): Promise<GetLogsReturnType<any>> => {
    try {
        return await client.getLogs({
            address: contractAddress,
            event: parseAbiItem([signature]),
            fromBlock: BigInt(genesisBlock),
            toBlock: 'latest'
        })
        
    } catch (err) {
        throw formattedError(err)
    }
}


export const readEventsDev = async (signature: string): Promise<GetLogsReturnType<any>> => {
    const blockNumber = await client.getBlockNumber()

    const event = {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_addr",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_addressName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_siret",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_siteName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_siteAddressName",
                "type": "string"
            }
        ],
        "name": "RegisterCreated",
        "type": "event"
    } as const
    
    try {

        return await client.getLogs({
            address: contractAddress,
            event: event,
            fromBlock: blockNumber - 20n,
            toBlock: 'latest'
        })
        
    } catch (err) {
        throw formattedError(err)
    }
}

export const TestReadEvent = async () => {
    return readEventsDev(RegisterCreated)
        .then(events => {
            let data: IRegisterCreated[] = []
            for (let i = 0; i < events.length; i++) {
                const e: any = events[i]
                const registerCreated: IRegisterCreated = {
                    account: e._addr as `0x${string}`,
                    name: e._name,
                    addressName: e._addressName,
                    siret: e._siret,
                    siteName: e._siteName,
                    siteAddressName: e._siteAddressName
                }
                data.push(registerCreated)
            }

            return data
        })
}

// The Graph (GraphQL)
/**
 * Get the registers (companies) created from events (TheGraphQl)
 * @returns {Promise<IRegisterCreated[]>} The list of registers (companies) created
 */
export const getRegisterCreateds = async (): Promise<IRegisterCreated[]> => {
    return execute(RegisterCreatedsDocument, {})
        .then((result)=> {
            let data: IRegisterCreated[] = []

            for (let i = 0; i < result?.data.registerCreateds.length; i++) {

                const e: any = result?.data.registerCreateds[i]
                const o: IRegisterCreated = {
                    account: e._addr as `0x${string}`,
                    name: e._name,
                    addressName: e._addressName,
                    siret: e._siret,
                    siteName: e._siteName,
                    siteAddressName: e._siteAddressName
                }
                data.push(o)
            }
            
            return data
        })
}

/**
 * Get the company accounts updated from events (TheGraphQl)
 * @returns {Promise<ICompanyAccountUpdated[]>} The list of company accounts updated
 */
export const getCompanyAccountUpdateds = async (): Promise<ICompanyAccountUpdated[]> => {
    return execute(CompanyAccountUpdatedsDocument, {})
        .then((result)=> {
            let data: ICompanyAccountUpdated[] = []

            for (let i = 0; i < result?.data.companyAccountUpdateds.length; i++) {

                const e: any = result?.data.companyAccountUpdateds[i]
                const o: ICompanyAccountUpdated = {
                    company: e._company as `0x${string}`,
                    account: e._account as `0x${string}`,
                    name: e._name,
                    firstName: e._firstName,
                    action: e._action
                }
                data.push(o)
            }
            
            return data
        })
}

/**
 * Get the verifers created from events (TheGraphQl)
 * @returns {Promise<IVerifierCreated[]>} The list of verifiers created
 */
export const getVerifierCreateds = async (): Promise<IVerifierCreated[]> => {
    return execute(VerifierCreatedsDocument, {})
        .then((result)=> {
            let data: IVerifierCreated[] = []

            for (let i = 0; i < result?.data.verifierCreateds.length; i++) {

                const e: any = result?.data.verifierCreateds[i]
                const o: IVerifierCreated = {
                    verifier: e._verifier as `0x${string}`,
                    name: e._name,
                    addressName: e._addressName,
                    siret: e._siret,
                    approvalNumber: e._approvalNumber,
                }
                data.push(o)
            }
            
            return data
        })
}

/**
 * Get the verifer account updated from events (TheGraphQl)
 * @returns {Promise<IVerifierAccountUpdated[]>} The list of verifiers account updated
 */
export const getVerifierAccountUpdateds = async (): Promise<IVerifierAccountUpdated[]> => {
    return execute(VerifierAccountUpdatedsDocument, {})
        .then((result)=> {
            let data: IVerifierAccountUpdated[] = []

            for (let i = 0; i < result?.data.verifierAccountUpdateds.length; i++) {

                const e: any = result?.data.verifierAccountUpdateds[i]
                const o: IVerifierAccountUpdated = {
                    verifier: e._verifier as `0x${string}`,
                    account: e._account,
                    name: e._name,
                    firstName: e._firstName,
                    action: e._action,
                }
                data.push(o)
            }
            
            return data
        })
}

/**
 * Get the verifer added to company from events (TheGraphQl)
 * @returns {Promise<IVerifierAddedToCompany[]>} The list of verifiers added to company
 */
export const getVerifierAddedToCompanies = async (): Promise<IVerifierAddedToCompany[]> => {
    return execute(VerifierAddedToCompaniesDocument, {})
        .then((result)=> {
            let data: IVerifierAddedToCompany[] = []

            for (let i = 0; i < result?.data.verifierAddedToCompanies.length; i++) {

                const e: any = result?.data.verifierAddedToCompanies[i]
                const o: IVerifierAddedToCompany = {
                    verifier: e._verifier as `0x${string}`,
                    company: e._company,
                }
                data.push(o)
            }
            
            return data
        })
}

/**
 * Get the verification tasks validated from events (TheGraphQl)
 * @returns {Promise<IVerificationTaskValidated[]>} The list of verification tasks validated
 */
export const getVerificationTaskValidateds = async (): Promise<IVerificationTaskValidated[]> => {
    return execute(VerificationTaskValidatedsDocument, {})
        .then((result)=> {
            let data: IVerificationTaskValidated[] = []

            for (let i = 0; i < result?.data.verificationTaskValidateds.length; i++) {

                const e: any = result?.data.verificationTaskValidateds[i]
                const o: IVerificationTaskValidated = {
                    verifier: e._verifier as `0x${string}`,
                    taskId: e._taskId,
                    taskStatus: e._taskStatus
                }
                data.push(o)
            }
            
            return data
        })
}

/**
 * Get the verification tasks updated from events (TheGraphQl)
 * @returns {Promise<IVerificationTaskUpdated[]>} The list of verification tasks updated
 */
export const getVerificationTaskUpdateds = async (): Promise<IVerificationTaskUpdated[]> => {
    return execute(VerificationTaskUpdatedsDocument, {})
        .then((result)=> {
            let data: IVerificationTaskUpdated[] = []

            for (let i = 0; i < result?.data.verificationTaskUpdateds.length; i++) {

                const e: any = result?.data.verificationTaskUpdateds[i]
                const o: IVerificationTaskUpdated = {
                    company: e._company as `0x${string}`,
                    taskId: e._taskId,
                    taskStatus: e._taskStatus
                }
                data.push(o)
            }
            
            return data
        })
}

/**
 * Get the account profiles for a company.
 * @param {IRegisterCreated[]} registerCreateds The list of companies
 * @param {ICompanyAccountUpdated[]} companyAccounts The list of company accounts
 * @returns {ICompanyProfile[]} The list of company account profiles
 */
const getCompanyAccounts = (
    registerCreateds: IRegisterCreated[], 
    companyAccounts: ICompanyAccountUpdated[]
): ICompanyProfile[] => {
    let companiesProfile: ICompanyProfile[] = []

    companyAccounts.map((companyAccount) => {
        
        const i = registerCreateds.findIndex(
            (registerCompany) => registerCompany.account === companyAccount.company
        )

        if (i !== -1) {
            companiesProfile.push({
                company: companyAccount.company,
                account: companyAccount.account,
                name: companyAccount.name,
                firstName: companyAccount.firstName,
                nameCompany: registerCreateds[i].name,
                addressName: registerCreateds[i].addressName,
                siret: registerCreateds[i].siret,
            })
        }
    })

    return companiesProfile
}

/**
 * Get the account profiles for a verifier company.
 * @param {IVerifierCreated[]} verifierCreateds The list of verifier companies
 * @param {IVerifierAccountUpdated[]} verifierAccounts The list of verifier accounts
 * @returns {IVerifierProfile[]} The list of verifier account profiles
 */
const getVerifierAccounts = (
    verifierCreateds: IVerifierCreated[], 
    verifierAccounts: IVerifierAccountUpdated[]
): IVerifierProfile[] => {
    let verifiersProfile: IVerifierProfile[] = []

    verifierAccounts.map((verifierAccount) => {
        
        const i = verifierCreateds.findIndex(
            (verifierAsAccount) => verifierAsAccount.verifier === verifierAccount.verifier
        )

        if (i !== -1) {
            verifiersProfile.push({
                verifier: verifierAccount.verifier,
                account: verifierAccount.account,
                name: verifierAccount.name,
                firstName: verifierAccount.firstName,
                nameCompany: verifierCreateds[i].name,
                addressName: verifierCreateds[i].addressName,
                siret: verifierCreateds[i].siret,
                approvalNumber: verifierCreateds[i].approvalNumber
            })
        }
    })

    return verifiersProfile
}


/**
 * Identify the profile account based on ID or address 
 * @param {IRegisterCreated[]} registerCreateds The registers (or companies) created
 * @param {ICompanyAccountUpdated[]} companyAccounts The company accounts
 * @param {IVerifierCreated[]} verifierCreateds The verifier companies created
 * @param {IVerifierAccountUpdated[]} verifierAccounts The verifier accounts
 * @param {`0x${string}`} id The account address
 * @returns {string | undefined} The profile account
 */
const getAccountProfile = (
    registerCreateds: IRegisterCreated[],
    companyAccounts: ICompanyAccountUpdated[],
    verifierCreateds: IVerifierCreated[],
    verifierAccounts: IVerifierAccountUpdated[],
    id?: `0x${string}`, 
): string | undefined => {
    if ( !id ) return undefined

    // Identify company
    for ( const registerCreated of registerCreateds ) {
        if( registerCreated.account.toLowerCase() === id.toLowerCase() )
            return 'company'
    }
    
    for ( const companyAccount of companyAccounts ) {
        if( companyAccount.account.toLowerCase() === id.toLowerCase() )
            return 'company'
    }
    
    // Identify verifer
    for ( const verifierCreated of verifierCreateds ) {
        if( verifierCreated.verifier.toLowerCase() === id.toLowerCase() )
            return 'verifier'
    }
    
    for ( const verifierAccount of verifierAccounts ) {
        if( verifierAccount.account.toLowerCase() === id.toLowerCase() )
            return 'verifier'
    }
}


/**
 * Get the verification tasks events from GraphQl.
 * @param {number} first The first 'n' elements to retrieve 
 * @param {number} skip The number of elements to skip
 * @param {`0x${string}`} id The account address
 * @param {string} accountProfile The account profile
 * @returns {Promise<IVerificationTaskCreated[]>} The verification tasks events
 */
export const getVerificationTaskCreateds = async (
    first: number,
    skip: number,
    id?: `0x${string}`,
    accountProfile?: string
): Promise<IVerificationTaskCreated[]> => {
    interface IParams {
        _company?: `0x${string}`,
        _verifier?: `0x${string}`,
        first: number,
        skip: number
    }

    let params: IParams = {
        first: first,
        skip: skip
    }

    let query: Promise<any> 

    if ( id && accountProfile === 'company' ) {
        params._company = id
        query = execute(VerificationTaskCreatedsByCompanyDocument, params)
    } else if ( id && accountProfile === 'verifier' ) {
        params._verifier = id
        query = execute(VerificationTaskCreatedsByVerifierDocument, params)
    } else {
        query = execute(VerificationTaskCreatedsDocument, params)
    }

    return query
        .then((result)=> {
            let data: IVerificationTaskCreated[] = []

            for (let i = 0; i < result?.data.verificationTaskCreateds.length; i++) {

                const e: any = result?.data.verificationTaskCreateds[i]
                const o: IVerificationTaskCreated = {
                    company: e._company as `0x${string}`,
                    verifier: e._verifier as `0x${string}`,
                    registerId: e._registerId,
                    securityType: e._securityType,
                    taskId: e._taskId,
                    taskStatus: e._taskStatus,
                    siteName: e._siteName,
                    timeStamp: e._timestamp
                }
                data.push(o)
            }
            
            return data
        })
}


const DEFAULT_GRAPHQL_PAGINATION_FIRST = 10
/**
 * Get verification tasks from events.
 * Consolidate data to a Register object: @IRegisters
 * @param {number} first The GraphQl pagination first attribute
 * @param {number} skip The GraphQl pagination skip attribute
 * @param {`0x${string}`} id The address ID or account
 * @returns {Promise<IRegisters>} The verification tasks consolidated
 */
export const getVerificationTasksFromEvents = async (
    first: number = DEFAULT_GRAPHQL_PAGINATION_FIRST,
    skip: number = 0,
    id?: `0x${string}`,
): Promise<IRegisters> => {
    const registerCreateds: IRegisterCreated[] = await getRegisterCreateds()
    const companyAccounts: ICompanyAccountUpdated[] = await getCompanyAccountUpdateds()
    const verifierCreateds: IVerifierCreated[] = await getVerifierCreateds()
    const verifierAccounts: IVerifierAccountUpdated[] = await getVerifierAccountUpdateds()
    const accountProfile: string | undefined = getAccountProfile(registerCreateds, companyAccounts, verifierCreateds, verifierAccounts, id)
    const verificationTaskCreateds: IVerificationTaskCreated[] =  await getVerificationTaskCreateds(first, skip, id, accountProfile)
    const verificationTaskValidateds: IVerificationTaskValidated[] = await getVerificationTaskValidateds()
    const verificationTaskUpdateds: IVerificationTaskUpdated[] = await getVerificationTaskUpdateds()

    return {
        verificationTasks: verificationTaskCreateds,
        verificationTaskValidateds: verificationTaskValidateds,
        verificationTaskUpdateds: verificationTaskUpdateds,
        registerCreateds: registerCreateds,
        companyAccounts: companyAccounts,
        verifierProfiles: getVerifierAccounts(verifierCreateds, verifierAccounts),
        companyProfiles: getCompanyAccounts(registerCreateds, companyAccounts),
        accountProfile: accountProfile,
    }
}




// SecurityRegister Smart contract methods

export const getVerificationTaskStatus = async (address: `0x${string}`, taskId: bigint): Promise<bigint> => {
    return readContractByFunctionName<bigint>('getVerificationTaskStatus', address, taskId)
        .then(taskStatus => taskStatus)
        .catch((err) => {
            console.log(err)
            return BigInt("0")
        })
}


export const isVerifierAccount = async (address: `0x${string}`, _account: `0x${string}`): Promise<boolean> => {
    return readContractByFunctionName<boolean>('isVerifierAccount', address, _account )
        .then(value => value)
}

export const isCompanyAccount = async (address: `0x${string}`, _account: `0x${string}`): Promise<boolean> => {
    return readContractByFunctionName<boolean>('isCompanyAccount', address, _account )
        .then(value => value)
}


export const isCompanyFromContract = async (address: `0x${string}`): Promise<boolean> => {
    return readContractByFunctionName<boolean>('isCompany', address, address )
        .then(value => value)
}


// write contract


export const safeMint = async (_tokenId: bigint, _tokenURI: string) => {
    writeContractByFunctionName('safeMint', _tokenId, _tokenURI)
        .then(hash => console.log("safeMint => " + hash))
        .catch(err => console.log("safeMint error => " + err))
}


const formattedError = (err: any): Error => {
    if (err instanceof BaseError) {
        // Option 1: checking the instance of the error
        if (err.cause instanceof ContractFunctionRevertedError) {
            const cause: ContractFunctionRevertedError = err.cause
            const error = cause.reason ?? 'Unknown error'

            throw new Error(error)
        }

        // Option 2: using `walk` method from `BaseError`
        const revertError: any = err.walk(err => err instanceof ContractFunctionRevertedError)
        if (revertError) {
            const error = revertError.data?.message ?? 'Unknown error'

            throw new Error(error)
        }
    }


    throw new Error(err.message)
}



// Events

export const getVerificationTaskUpdatedEvents = async () => {
    return readEvents(VerificationTaskUpdated)
        .then(events => {
            let data: IVerificationTaskUpdated[] = []
            for (let i = 0; i < events.length; i++) {
                const e: any = events[i]
                const verificationTaskUpdated = {
                    company: e._company,
                    taskId: e._taskId,
                    taskStatus: e._taskStatus
                }
                data.push(verificationTaskUpdated)
            }
            return data
        })
}


export  const getRegisterCreatedEvents = async () => {
    return readEvents(RegisterCreated)
        .then(events => {
            let data: IRegisterCreated[] = []
            for (let i = 0; i < events.length; i++) {
                const e: any = events[i]
                const registerCreated: IRegisterCreated = {
                    account: e._addr as `0x${string}`,
                    name: e._name,
                    addressName: e._addressName,
                    siret: e._siret,
                    siteName: e._siteName,
                    siteAddressName: e._siteAddressName
                }
                data.push(registerCreated)
            }

            return data
        })
}


export  const getCompanyAccountUpdatedEventsv2 = async () => {
    return readEvents(CompanyAccountUpdated)
        .then(events => {
            let data: ICompanyAccountUpdated[] = []
            for (let i = 0; i < events.length; i++) {
                const e: any = events[i]
                const companyAccountUpdated: ICompanyAccountUpdated = {
                    company: e._company,
                    account: e._account,
                    name: e._name,
                    firstName: e._firstName,
                    action: e._action
                }
                data.push(companyAccountUpdated)
            }
            return data
        })
}
export  const getCompanyAccountUpdatedEvents = async () => {
    return readEvents(CompanyAccountUpdated)
        .then(events => {
            let data: any[] = []
            for (let i = 0; i < events.length; i++) {
                const e: any = events[i]
                data.push([e._company, e._account, e._name, e._firstName, e._action])
            }
            return data
        })
}


export  const getVerifierAddedToCompanyEvents = async () => {
    return readEvents(VerifierAddedToCompany)
        .then(events => {
            let data: any[] = []
            for (let i = 0; i < events.length; i++) {
                const e: any = events[i]
                data.push([e._company, e._verifier])
            }
            return data
        })
}

export  const getVerifierAddedToCompanyEventsv2 = async () => {
    return readEvents(VerifierAddedToCompany)
        .then(events => {
            let data: IVerifierAddedToCompany[] = []
            for (let i = 0; i < events.length; i++) {
                const e: any = events[i]
                const verifierAddedToCompany: IVerifierAddedToCompany = {
                    company: e._company,
                    verifier: e._verifier
                }
                data.push(verifierAddedToCompany)
            }
            return data
        })
}

export  const getVerificationTaskCreatedEventsv2 = async () => {
    return readEvents(VerificationTaskCreated)
        .then(events => {
            let data: IVerificationTaskCreated[] = []
            
            for (let i = 0; i < events.length; i++) {
                const e: any = events[i]
                const verificationTaskCreated: IVerificationTaskCreated = {
                    company: e._company,
                    verifier: e._verifier,
                    registerId: e._registerId,
                    securityType: e._securityType,
                    taskId: e._taskId,
                    taskStatus: e._taskStatus,
                    siteName: e._siteName,
                    timeStamp: e._timestamp
                }

                data.push(verificationTaskCreated)
            }
            return data
        })
}

export  const getVerificationTaskCreatedEvents = async () => {
    return readEvents(VerificationTaskCreated)
        .then(events => {
            let data: any[] = []
            for (let i = 0; i < events.length; i++) {
                const e: any = events[i]
                data.push([e._company, e._verifier, e._registerId, e._securityType, e._taskId, e._taskStatus])
            }
            return data
        })
}

export const getVerificationTaskValidatedEvents = async () => {
    return readEvents(VerificationTaskValidated)
        .then(events => {
            let data: any[] = []
            for (let i = 0; i < events.length; i++) {
                const e: any = events[i]
                data.push([e._verifier, e._taskId, e._taskStatus])
            }
            return data
        })
}

export const getVerificationTaskValidatedEventsv2 = async () => {
    return readEvents(VerificationTaskValidated)
        .then(events => {
            let data: IVerificationTaskValidated[] = []
            for (let i = 0; i < events.length; i++) {
                const e: any = events[i]
                const verificationTaskValidated: IVerificationTaskValidated = {
                    verifier: e._verifier,
                    taskId: e._taskId,
                    taskStatus: e._taskStatus
                }
                data.push(verificationTaskValidated)
            }
            return data
        })
}

export const getRegisterVerification = (registerId: number): string => {
    return RegisterVerificationId[registerId]
}

export const getRegisterVerifications = (): string[] => {
    return [...RegisterVerificationId]
}

export const convertTimestampToDate = (timestamp: number) => {
    const dateObject = new Date(timestamp * 1000)

    let date = new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(dateObject)
    return date
}

// Verifier section


export const getVerifiersProfile = async (): Promise<IVerifierProfile[]> => {
    let verifiersProfile: IVerifierProfile[] = []

    const verifiersAsCompany = await getVerifierCreatedEvents()
    const verifiersAsAccount = await getVerifierAccountUpdatedEventsv2()

    verifiersAsAccount.map((verifierAccount) => {

        const i = verifiersAsCompany.findIndex(
            (verifierAsAccount) => verifierAsAccount.verifier === verifierAccount.verifier)

        if (i !== -1) {
            verifiersProfile.push({
                verifier: verifierAccount.verifier,
                account: verifierAccount.account,
                name: verifierAccount.name,
                firstName: verifierAccount.firstName,
                nameCompany: verifiersAsCompany[i].name,
                addressName: verifiersAsCompany[i].addressName,
                siret: verifiersAsCompany[i].siret,
                approvalNumber: verifiersAsCompany[i].approvalNumber
            })
        }
    })

    return verifiersProfile
}


export const getVerifierProfileByAccountv2 = async (account: string): Promise<IVerifierProfile | undefined> => {
    const data = await getVerifiersProfile()

    let _verifierProfile: IVerifierProfile | undefined

    data.map((verifierProfile) => {
        if (verifierProfile.account === account || verifierProfile.verifier === account)
            _verifierProfile = verifierProfile
    });

    return _verifierProfile
}


export const getVerifierCreatedEvents = async () => {
    return readEvents(VerifierCreated)
        .then(events => {
            let data: IVerifierCreated[] = []
            for (let i = 0; i < events.length; i++) {
                const e: any = events[i]
                const verifierCreated = {
                    verifier: e._verifier,
                    name: e._name,
                    addressName: e._addressName,
                    siret: e._siret,
                    approvalNumber: e._approvalNumber
                }
                data.push(verifierCreated)
            }
            return data
        })
}


export  const getVerifierAccountUpdatedEventsv2 = async () => {
    return readEvents(VerifierAccountUpdated)
        .then(events => {
            let data: IVerifierAccountUpdated[] = []
            for (let i = 0; i < events.length; i++) {
                const e: any = events[i]
                const verifierAccountUpdated: IVerifierAccountUpdated = {
                    verifier: e._verifier,
                    account: e._account,
                    name: e._name,
                    firstName: e._firstName,
                    action: e._action
                }

                data.push(verifierAccountUpdated)
            }
            return data
        })
}

export  const getVerifierAccountUpdatedEvents = async () => {
    return readEvents(VerifierAccountUpdated)
        .then(events => {
            let data: any[] = []
            for (let i = 0; i < events.length; i++) {
                const e: any = events[i]
                data.push([e._verifier, e._account, e._name, e._firstName, e._action])
            }
            return data
        })
}
