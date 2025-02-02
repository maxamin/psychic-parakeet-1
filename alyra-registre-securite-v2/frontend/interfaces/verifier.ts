export interface Verifier {
    name: string
    addressName: string
    siret: string
    approvalNumber: string
}

export interface VerifierAccount {
    verifier: `0x${string}`
    active: boolean
}

export interface IVerifierProfile {
    verifier: `0x${string}`
    account: `0x${string}`
    name: string
    firstName: string
    nameCompany: string
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
export interface IVerifierCreated {
    verifier: `0x${string}`
    name: string
    addressName: string
    siret: string
    approvalNumber: string
}export interface IVerifierAddedToCompany {
    company: `0x${string}`
    verifier: `0x${string}`
}

