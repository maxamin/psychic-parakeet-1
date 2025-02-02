"use client"

import { createContext, ReactNode, useContext, useState } from "react"

export interface ICompany {
    addr: string
    name :string
    addressName: string
    siret: string
}

export interface IVerifier {
    addr: string
    name :string
    addressName: string
    siret: string
    approval: string
}

interface IIdentityProps {
    isCompany: boolean
    setIsCompany: (company: boolean) => void
    company: Partial<ICompany>
    setCompany: (company: Partial<ICompany>) => void
    isVerifier: boolean
    setIsVerifier: (verifier: boolean) => void
    verifier: Partial<IVerifier>
    setVerifier: (verifier: Partial<IVerifier>) => void

    accountRefresh: boolean
    setAccountRefresh: (accountRefresh: boolean) => void
    verifierToCompanyRefresh: boolean
    setVerifierToCompanyRefresh: (verifierToCompanyRefresh: boolean) => void
    addSiteRefresh: boolean
    setAddSiteRefresh: (addSiteRefresh: boolean) => void
    verificationTaskRefresh: boolean
    setVerificationTaskRefresh: (verificationTaskRefresh: boolean) => void
    createVerificationTaskRefresh: boolean
    setCreateVerificationTaskRefresh: (createVerificationTaskRefresh: boolean) => void
    approveVerificationTaskRefresh: boolean
    setApproveVerificationTaskRefresh: (approveVerificationTaskRefresh: boolean) => void
    selectedVerificationTask: number
    setSelectedVerificationTask: (selectedVerificationTask: number) => void
    selectedScreen: string
    setSelectedScreen: (selectedScreen: string) => void
    verificationTaskStatus: boolean
    setVerificationTaskStatus: (verificationTaskStatus: boolean) => void
    refreshScreen: number
    setRefreshScreen: (refreshScreen: number) => void
}

const IdentityContext = createContext<IIdentityProps>({
    isCompany: false,
    setIsCompany: () => false,
    company: {},
    setCompany: () => {},
    isVerifier: false,
    setIsVerifier: () => false,
    verifier: {},
    setVerifier: () => {},
    accountRefresh: false,
    setAccountRefresh: () => false,
    verifierToCompanyRefresh: false,
    setVerifierToCompanyRefresh: () => false,
    addSiteRefresh: false,
    setAddSiteRefresh: () => false,
    verificationTaskRefresh: false,
    setVerificationTaskRefresh: () => false,
    createVerificationTaskRefresh: false,
    setCreateVerificationTaskRefresh: () => false,
    approveVerificationTaskRefresh: false,
    setApproveVerificationTaskRefresh: () => false,
    selectedVerificationTask: 0,
    setSelectedVerificationTask: () => 0,
    selectedScreen: "",
    setSelectedScreen: () => "",
    verificationTaskStatus: false,
    setVerificationTaskStatus: () => false,
    refreshScreen: 0,
    setRefreshScreen: () => 0,
})

export const IdentityContextProvider = ({ children }: { children: ReactNode }) => {
    const [isCompany, setIsCompany] = useState(false)
    const [company, setCompany] = useState<Partial<ICompany>>({})
    const [isVerifier, setIsVerifier] = useState(false)
    const [verifier, setVerifier] = useState<Partial<IVerifier>>({})
    const [accountRefresh, setAccountRefresh] = useState(false)
    const [verifierToCompanyRefresh, setVerifierToCompanyRefresh] = useState(false)
    const [addSiteRefresh, setAddSiteRefresh] = useState(false)
    const [verificationTaskRefresh, setVerificationTaskRefresh] = useState(false)
    const [createVerificationTaskRefresh, setCreateVerificationTaskRefresh] = useState(false)
    const [approveVerificationTaskRefresh, setApproveVerificationTaskRefresh] = useState(false)
    const [selectedVerificationTask, setSelectedVerificationTask] = useState(0)
    const [selectedScreen, setSelectedScreen] = useState("")
    const [verificationTaskStatus, setVerificationTaskStatus] = useState(false)
    const [refreshScreen, setRefreshScreen] = useState(0)

    return (

        <IdentityContext.Provider value={{
            isCompany: isCompany,
            setIsCompany: setIsCompany,
            company: company,
            setCompany: setCompany,
            isVerifier: isVerifier,
            setIsVerifier: setIsVerifier,
            verifier: verifier,
            setVerifier: setVerifier,
            accountRefresh: accountRefresh,
            setAccountRefresh: setAccountRefresh,
            verifierToCompanyRefresh: verifierToCompanyRefresh,
            setVerifierToCompanyRefresh: setVerifierToCompanyRefresh,
            addSiteRefresh: addSiteRefresh,
            setAddSiteRefresh: setAddSiteRefresh,
            verificationTaskRefresh: verificationTaskRefresh,
            setVerificationTaskRefresh: setVerificationTaskRefresh,
            createVerificationTaskRefresh: createVerificationTaskRefresh,
            setCreateVerificationTaskRefresh: setCreateVerificationTaskRefresh,
            approveVerificationTaskRefresh: approveVerificationTaskRefresh,
            setApproveVerificationTaskRefresh: setApproveVerificationTaskRefresh,
            selectedVerificationTask: selectedVerificationTask,
            setSelectedVerificationTask: setSelectedVerificationTask,
            selectedScreen: selectedScreen,
            setSelectedScreen: setSelectedScreen,
            verificationTaskStatus: verificationTaskStatus,
            setVerificationTaskStatus: setVerificationTaskStatus,
            refreshScreen: refreshScreen,
            setRefreshScreen: setRefreshScreen,
        }}>
            {children}
        </IdentityContext.Provider>
    )
}

export const useIdentityContext = () => useContext(IdentityContext)
