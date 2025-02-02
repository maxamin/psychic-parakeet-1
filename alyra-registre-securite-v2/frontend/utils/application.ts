import {
    IVerificationTaskConsolidated,
    IVerificationTaskCreated, IVerificationTaskUpdated, IVerificationTaskValidated
} from "@/interfaces/verificationTasks"
import {
    ICompanyAccountUpdated,
    IRegisterCreated,
    IRegisters
} from "@/interfaces/registers"
import { IVerifierProfile } from "@/interfaces/verifier"
import { getMetadataFromIPFS } from "@/utils/metadata"
import { PinataPinListResponse } from "@pinata/sdk"



/**
 * Get the verification tasks consolidated.
 * @returns {IVerificationTaskConsolidated[]} The verification tasks consolidated.
 */
export const verificationTaskOrigin = (registers: IRegisters | undefined, address?: `0x${string}`): IVerificationTaskConsolidated[] => {
    let verificationTasksCreated: IVerificationTaskConsolidated[] = []

    registers?.verificationTasks.map((task: IVerificationTaskCreated) => {
        let verifierProfile: IVerifierProfile | undefined
        let registerCreated: IRegisterCreated | undefined
        let companyAccount: ICompanyAccountUpdated | undefined

        // Registers (sites)
        registers?.registerCreateds.map((_registerCreated: IRegisterCreated) => {
            if (_registerCreated.siteName === task.siteName)
                registerCreated = _registerCreated
        })

        // Company accounts
        registers?.companyAccounts.map((_companyAccount: ICompanyAccountUpdated) => {
            if (_companyAccount.company === task.company)
                companyAccount = _companyAccount
        })

        // Read Verifier profile
        registers?.verifierProfiles.map((_verifierProfile: IVerifierProfile) => {
            if (_verifierProfile.verifier === task.verifier)
                verifierProfile = _verifierProfile
        })

        // Read validated state for task status
        registers?.verificationTaskValidateds.map((verificationTaskValidated: IVerificationTaskValidated) => {
            if (verificationTaskValidated.taskId === task.taskId && verificationTaskValidated.taskStatus > task.taskStatus)
                task.taskStatus = verificationTaskValidated.taskStatus
        })

        // Read updated state for task status
        registers?.verificationTaskUpdateds.map((verificationTaskUpdated: IVerificationTaskUpdated) => {
            if (verificationTaskUpdated.taskId === task.taskId && verificationTaskUpdated.taskStatus > task.taskStatus)
                task.taskStatus = verificationTaskUpdated.taskStatus
        })

        const verificationTaskCreated: IVerificationTaskConsolidated = {
            company: task.company,
            companyName: registerCreated?.name ?? "",
            companyAddress: registerCreated?.addressName ?? "",
            siteName: task.siteName,
            siteAddress: registerCreated?.siteAddressName ?? "",
            companySiret: registerCreated?.siret || "",
            companyAccount: address as `0x${string}`,
            companyAccountName: companyAccount?.name || "",
            companyAccountFirstName: companyAccount?.firstName || "",
            registerId: task.registerId,
            securityType: task.securityType,
            taskId: task.taskId,
            taskStatus: task.taskStatus,
            timeStamp: task.timeStamp,
            verifier: task.verifier,
            verifierCompanyName: verifierProfile?.nameCompany ?? "",
            verifierAddressName: verifierProfile?.addressName ?? "",
            verifierSiret: verifierProfile?.siret ?? "",
            verifierApprovalNumber: verifierProfile?.approvalNumber ?? "",
            verifierAccount: verifierProfile?.account ?? "0x",
            verifierName: verifierProfile?.name ?? "",
            verifierFirstName: verifierProfile?.firstName ?? "",
        }
        verificationTasksCreated.push(verificationTaskCreated)
    })

    return verificationTasksCreated
}