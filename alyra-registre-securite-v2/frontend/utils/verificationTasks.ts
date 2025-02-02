import { ICompanyAccountUpdated, IRegisterCreated } from "@/interfaces/registers"
import {
    CompanyAccountUpdatedsPaginationDocument,
    execute,
    RegisterCreatedsDocument,
    RegisterCreatedsPaginationDocument,
    VerificationTaskCreatedsByCompanyDocument,
    VerificationTaskCreatedsByVerifierDocument,
    VerificationTaskCreatedsDocument,
    VerifierCreatedsPaginationDocument
} from "@/.graphclient"
import { IVerificationTaskCreated } from "@/interfaces/verificationTasks"
import { IVerifierCreated } from "@/interfaces/verifier"
import { IVerificationTaskEditStatus } from "@/interfaces/intl"
import { verificationTaskEditStatusIntl } from "@/utils/intl"

const DEFAULT_GRAPHQL_PAGINATION_FIRST = 10


/**
 *
 * @param taskStatus
 */
export const getTaskEditStatusName = (taskStatus: number): string => {
    const verificationTaskEditStatus: IVerificationTaskEditStatus = verificationTaskEditStatusIntl()

    return verificationTaskEditStatus.status[taskStatus]
}



/**
 * Get the registers (companies) created from events (TheGraphQl)
 * @returns {Promise<IRegisterCreated[]>} The list of registers (companies) created
 */
export const getRegisterCreatedsByCompany = async (
    address: `0x${string}`,
    first: number = DEFAULT_GRAPHQL_PAGINATION_FIRST,
    skip: number = 0,
): Promise<IRegisterCreated[]> => {
    interface IParams {
        _addr: `0x${string}`,
        first: number,
        skip: number
    }

    let params: IParams = {
        _addr: address,
        first: first,
        skip: skip
    }

    const query: Promise<any> = execute(RegisterCreatedsPaginationDocument, params)

    return query
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
* Get the company accounts created from events (TheGraphQl)
* @returns {Promise<ICompanyAccountUpdated[]>} The list of company accounts
*/
export const getCompanyAccountsByCompany = async (
    address: `0x${string}`,
    first: number = DEFAULT_GRAPHQL_PAGINATION_FIRST,
    skip: number = 0,
): Promise<ICompanyAccountUpdated[]> => {
    interface IParams {
        _company: `0x${string}`,
        first: number,
        skip: number
    }

    let params: IParams = {
        _company: address,
        first: first,
        skip: skip
    }

    const query: Promise<any> = execute(CompanyAccountUpdatedsPaginationDocument, params)

    return query
        .then((result)=> {
            let data: ICompanyAccountUpdated[] = []

            for (let i = 0; i < result?.data.companyAccountUpdateds.length; i++) {

                const e: any = result?.data.companyAccountUpdateds[i]
                const o: ICompanyAccountUpdated = {
                    company: e._company as `0x${string}`,
                    account: e._account as `0x${string}`,
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
 * Get the verification tasks created from events (TheGraphQl)
 * @returns {Promise<ICompanyAccountUpdated[]>} The list of verification tasks created
 */
export const getVerificationTaskCreatedsByCompany = async (
    address: `0x${string}`,
    first: number = DEFAULT_GRAPHQL_PAGINATION_FIRST,
    skip: number = 0,
): Promise<IVerificationTaskCreated[]> => {
    interface IParams {
        _company: `0x${string}`,
        first: number,
        skip: number
    }

    let params: IParams = {
        _company: address,
        first: first,
        skip: skip
    }

    const query: Promise<any> = execute(VerificationTaskCreatedsByCompanyDocument, params)

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
                    timeStamp: e._timestamp,
                }
                data.push(o)
            }

            return data
        })
}
/**
 * Get the verifiers created from events (TheGraphQl)
 * @returns {Promise<IVerifierCreated[]>} The list of verifiers created
 */
export const getVerifierCreatedsByAddress = async (
    addresses: `0x${string}`[],
    first: number = DEFAULT_GRAPHQL_PAGINATION_FIRST,
    skip: number = 0,
): Promise<IVerifierCreated[]> => {
    interface IParams {
        _verifier: `0x${string}`,
        first: number,
        skip: number
    }

    let verifierCreateds: IVerifierCreated[] = []

    for (const address of addresses) {
        let params: IParams = {
            _verifier: address,
            first: first,
            skip: skip
        }

        const query: Promise<any> = execute(VerifierCreatedsPaginationDocument, params)

        const d = await query
            .then((result)=> {
                let data: IVerifierCreated[] = []
                for (let i = 0; i < result?.data.verifierCreateds.length; i++) {
                    const e: any = result?.data.verifierCreateds[i]

                    const verifierCreated: IVerifierCreated = {
                        verifier: e._verifier as `0x${string}`,
                        name: e._name as `0x${string}`,
                        addressName: e._addressName,
                        siret: e._siret,
                        approvalNumber: e._approvalNumber,
                    }
                    data.push(verifierCreated)
                }
                return data
            })

        verifierCreateds = verifierCreateds.concat(d)
    }

    return verifierCreateds
}


export interface IVerificationTaskAggregate {
    registerCreateds:  IRegisterCreated[]
    companyAccounts: ICompanyAccountUpdated[]
    verificationTasks:  IVerificationTaskCreated[]
    verifiers: IVerifierCreated[]
    // verifierProfiles: IVerifierProfile[]
    // companyProfiles: ICompanyProfile[]
    // verificationTaskValidateds:  IVerificationTaskValidated[]
    // verificationTaskUpdateds:  IVerificationTaskUpdated[]
    // accountProfile: string | undefined
}
export const getVerificationTasksFromEventsByCompany = async (
    company: `0x${string}`,
    first: number = DEFAULT_GRAPHQL_PAGINATION_FIRST,
    skip: number = 0,
): Promise<IVerificationTaskAggregate> => {
    const registerCreateds: IRegisterCreated[] = await getRegisterCreatedsByCompany(company, first, skip)
    const companyAccounts: ICompanyAccountUpdated[] = await getCompanyAccountsByCompany(company, first, skip)
    const verificationTaskCreateds: IVerificationTaskCreated[] =  await getVerificationTaskCreatedsByCompany(company, first, skip)

    // Verifier addresses
    let verifierAddresses: `0x${string}`[] = []
    for ( const verificationTask of verificationTaskCreateds) {
        if (verifierAddresses.includes(verificationTask.verifier) )
            continue
        verifierAddresses.push(verificationTask.verifier)
    }

    const verifierCreateds: IVerifierCreated[] = await getVerifierCreatedsByAddress(verifierAddresses, first, skip)
    // const verifierAccounts: IVerifierAccountUpdated[] = await getVerifierAccountUpdateds()
    // const accountProfile: string | undefined = getAccountProfile(registerCreateds, companyAccounts, verifierCreateds, verifierAccounts, id)
    // const verificationTaskValidateds: IVerificationTaskValidated[] = await getVerificationTaskValidateds()
    // const verificationTaskUpdateds: IVerificationTaskUpdated[] = await getVerificationTaskUpdateds()

    return {
        registerCreateds: registerCreateds,
        companyAccounts: companyAccounts,
        verificationTasks: verificationTaskCreateds,
        verifiers: verifierCreateds,
        // verifierProfiles: getVerifierAccounts(verifierCreateds, verifierAccounts),
        // verificationTaskValidateds: verificationTaskValidateds,
        // verificationTaskUpdateds: verificationTaskUpdateds,
        // companyProfiles: getCompanyAccounts(registerCreateds, companyAccounts),
        // accountProfile: accountProfile,
    }
}