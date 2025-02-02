export interface IRegisterCreated {
    siteName: string
    siteAddressName: string
    siret: number
    name: string
    addressName: string
    addr: string
}
export interface ICompanyAccountUpdated {
    company: `0x${string}`
    account: `0x${string}`
    name: string
    firstName: string
    action: string
}
export interface IVerifierCreated {
    verifier: `0x${string}`
    name: string
    addressName: string
    siret: string
    approvalNumber: string
} 
export interface IVerifierAccountUpdated {
    verifier: `0x${string}`
    account: `0x${string}`
    name: string
    firstName: string
    action: string
} 
export interface IVerifierAddedToCompany {
    company: `0x${string}`
    verifier: `0x${string}`
} 
export interface IVerificationTaskCreated {
    company: `0x${string}`
    verifier: `0x${string}`
    registerId: BigInt
    securityType: string
    taskId: BigInt
    taskStatus: Number
    siteName: string
    timestamp: BigInt
} 
export interface IVerificationTaskValidated {
    verifier: `0x${string}`
    taskId: BigInt
    taskStatus: Number
} 
export interface IVerificationTaskUpdated {
    company: `0x${string}`
    taskId: BigInt
    taskStatus: Number
} 