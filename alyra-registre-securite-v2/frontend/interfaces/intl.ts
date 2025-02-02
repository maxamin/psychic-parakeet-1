import { ICompany, IVerifier } from "@/contexts/Identity"

export interface IToasterMessages {
    notConnectedTitle: string,
    notConnectedDescription: string
    unauthorizedTitle: string,
    unauthorizedDescription: string
    subscribeCompanyOkTitle: string
    subscribeCompanyOkDescription: string
    subscribeCompanyErrorTitle: string
    subscribeCompanyErrorDescription: string
    subscribeVerifierOkTitle: string
    subscribeVerifierOkDescription: string
    subscribeVerifierErrorTitle: string
    subscribeVerifierErrorDescription: string
    createVerificationTaskOkTitle: string
    createVerificationTaskOkDescription: string
    createVerificationTaskErrorTitle: string
    createVerificationTaskErrorDescription: string
    updateVerificationTaskStatusOkTitle: string
    updateVerificationTaskStatusOkDescription: string
    updateVerificationTaskStatusErrorTitle: string
    updateVerificationTaskStatusErrorDescription: string
    addSiteToCompanyOkTitle: string
    addSiteToCompanyOkDescription: string
    addSiteToCompanyErrorTitle: string
    addSiteToCompanyErrorDescription: string
}

export interface IIndex {
    title: string
}

export interface IHomePager{
    homePagerTitle: string
    homePagerSubtitle1: string
    homePagerSubtitle2: string
    homePagerSubtitle3: string
    subscribe: string
    descTitle: string
    descSubTitle: string
    descText1: string
    descText2: string
    descText3: string
    descText4: string
    descText5: string
    descText6: string
    descText7: string
    moreInfo: string
    cpyTitle: string
    cpyEnum1: string
    cpyEnum2: string
    cpyEnum3: string
    cpyEnum4: string
    cpyEnum5: string
    cpyVGPTitle: string
    cpyVGPEnum1: string
    cpyVGPEnum2: string
    consultRegisterTitle: string
    consultRegisterEnum1: string
    consultRegisterEnum2: string
    consultRegisterButton: string
}

export interface IHeaderFooter {
    title: string
    register: string
    showRegister: string
    member: string
    companySubscription: string
    verifierSubscription: string
    company: string
    verifier: string
    support: string
    faq: string
    documentation: string
    products: string
    contact: string
    developer: string
    helper: string
    rights: string
    home: string
}

export interface IFormSubscriptionCompany {
    title: string
    description: string
    name: string
    address: string
    siret: string
    siteName: string
    siteAddress: string
}

export interface IFormSubscriptionVerifier {
    title: string
    description: string
    name: string
    address: string
    siret: string
    approval: string
}

export interface ILayoutButton {
    validate: string
    subscribe: string
    save: string
    cancel: string
}

export interface ILayoutEventLog {
    linkTitle: string
    blockTitle: string
    title: string
    smartContractAddress: string
    blockHash: string
    transactionHash: string
    blockNumber: string
    publicKeyAddress: string
}

export interface IVerificationTaskFilters {
    title: string,
    pendingApproval: string,
    validated: string,
    approved: string,
    rejected: string,
    conditionallyApproved: string
    status: string[]
}

export interface IVerificationTaskEditStatus {
    title: string,
    validate: string,
    approve: string,
    reject: string,
    conditionallyApprove: string
    status: string[]
}

export interface IVerificationTaskFinalStatus {
    title: string,
    approve: string,
    reject: string,
    status: string[]
}

export interface ICreateVerificationTaskForm {
    title: string
    selectSite: string
    selectSector: string
    selectVerificationType: string
}

export interface IProfile {
    [key: string]: string
}
export interface IGeneral {
    previous: string
    next: string
    profile: string
    inProgress: string
    profiles: string[]
    profilesObj: IProfile
    selectAction: string
}

export interface ICompanyRootPageIntl {
    title: string
}

export interface IProfileAccount {
    isCompany: boolean
    company: ICompany | undefined
    isVerifier: boolean
    verifier: IVerifier | undefined
}

export interface IGeneralProfile {
    id: number
    profile: string
}