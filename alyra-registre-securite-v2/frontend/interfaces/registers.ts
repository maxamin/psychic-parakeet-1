import { IVerificationTaskCreated, IVerificationTaskValidated, IVerificationTaskUpdated } from "./verificationTasks"
import { IVerifierProfile } from "./verifier"

export interface IRegisterBase {
    account: `0x${string}`
    name: string
    addressName: string
    siret: string
}

export interface IRegisterCreated  extends IRegisterBase {
    siteName: string
    siteAddressName: string
}
export interface ICompanyAccountUpdated {
    company: `0x${string}`
    account: `0x${string}`
    name: string
    firstName: string
    action: string
}


export interface ICreateSiteModalForm {
    isModalOpen: boolean
    closeModal: () => void
}


export interface CompanyAccount {
    company: `0x${string}`
    active: boolean
}

export interface ICompanyProfile {
    company: `0x${string}`
    account: `0x${string}`
    name: string
    firstName: string
    nameCompany: string
    addressName: string
    siret: string
}

export interface Register {
    siteName: string
    securitySector: string
}
export interface IRegisters {
    verificationTasks:  IVerificationTaskCreated[]
    verifierProfiles: IVerifierProfile[]
    companyProfiles: ICompanyProfile[]
    registerCreateds:  IRegisterCreated[]
    verificationTaskValidateds:  IVerificationTaskValidated[]
    verificationTaskUpdateds:  IVerificationTaskUpdated[]
    companyAccounts: ICompanyAccountUpdated[]
    accountProfile: string | undefined
}

