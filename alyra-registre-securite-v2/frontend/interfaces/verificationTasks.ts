import { ChangeEvent } from "react"
import { IRegisterCreated } from "./registers"
import { PinataPinListResponse } from "@pinata/sdk"

// Interface based on Smart Contract events
export interface IVerificationTaskCreated {
    company: `0x${string}`
    verifier: `0x${string}`
    registerId: number
    securityType: string
    taskId: BigInt
    taskStatus: BigInt
    siteName: string
    timeStamp: BigInt
}


//
export interface IVerificationTaskConsolidated {
    taskId: BigInt
    taskStatus: BigInt
    registerId: number
    securityType: string
    timeStamp: BigInt
    company: `0x${string}`
    companyName: string
    companyAddress: string
    companySiret: string
    siteName: string
    siteAddress: string
    companyAccount: `0x${string}`
    companyAccountName: string
    companyAccountFirstName: string
    verifier: `0x${string}`
    verifierCompanyName: string
    verifierAddressName: string
    verifierSiret: string
    verifierApprovalNumber: string
    verifierAccount: `0x${string}`
    verifierName: string
    verifierFirstName: string
}

export interface IVerificationTaskGrid {
    pageTitle: string
    searchBar: string
    createVerificationButton: string
    sectors: string[]
    fieldGridTitle: string
    fieldGridValues: string[]
    fieldSubGridFirstTitle: string
    fieldSubGridFirstValues: string[]
    fieldSubGridSecondTitle: string
    fieldSubGridSecondValues: string[]
    fieldSubGridThirdTitle: string
    fieldSubGridThirdValues: string[]
}
export interface IHeaderAttributes {
    grid: { style: string }
    rows: { [key: string]: { style: string } }
}

export interface IVerificationTaskGridMain {
    loading: boolean
    tasks: IVerificationTaskConsolidated[]
    fieldsGrid: IVerificationTaskGrid
    first: number
    skip: number
    pagination: IValueLabelId[]
    handlePagination: (first: number, skip: number) => void
    headerAttributes: IHeaderAttributes
    accountProfile: string | undefined
}

export interface ITaskStatus {
    status: boolean
    id: string
}
export interface IFilterByCheckbox {
    checkboxes: { [key: string]: ITaskStatus }
    handleCheckboxChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export interface IVerificationTaskFooter {
    eventSum: number
    first: number
    skip: number
    pagination: IValueLabelId[]
    handlePagination: (first: number, skip: number) => void
}

export interface IVerificationTaskDetail {
    toggleLog: boolean
    index: number
    selectedTask: IVerificationTaskConsolidated | undefined
    fieldsGrid: IVerificationTaskGrid
    metadata: PinataPinListResponse | undefined
}

export interface headerGrid {
    id: number
    title: string
    style: string
}

export interface IVerificationTaskGridRow {
    index: string
    toggleLog: boolean
    task: IVerificationTaskConsolidated
    selectedTask: IVerificationTaskConsolidated | undefined
    fieldsGrid: IVerificationTaskGrid    
    onClick: (data: IVerificationTaskConsolidated, selectedTask: IVerificationTaskConsolidated | undefined) => void
    attributes: headerGrid[]
    gridStyle: string
    accountProfile: string | undefined
    metadata?: PinataPinListResponse
}

export interface IVerificationTaskValidated {
    verifier: `0x${string}`
    taskId: BigInt
    taskStatus: BigInt
}
export interface IVerificationTaskUpdated {
    company: `0x${string}`
    taskId: BigInt
    taskStatus: BigInt

}

export interface IVerificationTaskMetadata {
    taskId: string
    status: string
    sector: string
    type: string
    date: string
    timestamp: string
    company: {
        account: `0x${string}`
        name: string
        address: string
        site: string
        siteAddress: string
        siret: string
        companyAccount: {
            account: `0x${string}`
            name: string
            firstName: string
        }
    }
    verifier: {
        account: `0x${string}`
        name: string
        address: string
        siret: string
        approvalNumber: string
        verifierAccount: {
            account: `0x${string}`
            name: string
            firstName: string
        }
    }
}

export interface IVerificationTaskModalForm {
    isModalOpen: boolean
    closeModal: () => void 
    verificationTaskModalForm: IRegisterCreated[]
}