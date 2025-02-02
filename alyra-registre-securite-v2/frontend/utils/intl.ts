import { useTranslations } from 'next-intl'
import {
    ICompanyRootPageIntl,
    ICreateVerificationTaskForm,
    IFormSubscriptionCompany,
    IFormSubscriptionVerifier,
    IGeneral,
    IGeneralProfile,
    IHeaderFooter,
    IHomePager,
    IIndex,
    ILayoutButton,
    ILayoutEventLog,
    IProfile,
    IProfileAccount,
    IToasterMessages,
    IVerificationTaskEditStatus,
    IVerificationTaskFilters,
    IVerificationTaskFinalStatus
} from '@/interfaces/intl'
import { IVerificationTaskGrid } from "@/interfaces/verificationTasks"
import { ITaskStatusEditAction, ITaskStatusFinalStatus, } from '@/constants/enums'
import {
    getRegisterCreatedsByCompany,
    getVerifierCreatedsByAddress
} from "@/utils/verificationTasks"
import { ICompany, IVerifier } from "@/contexts/Identity"


export const getCompanyAccount = (address: `0x${string}`): Promise<ICompany | undefined> => {
    return getRegisterCreatedsByCompany(address)
        .then((registerCreated) => {
            if (registerCreated.length > 0) {

                return {
                    addr: registerCreated[0].account,
                    name : registerCreated[0].name,
                    addressName: registerCreated[0].addressName,
                    siret: registerCreated[0].siret,
                }
            }
        })
}

export const getVerifierAccount = (address: `0x${string}`): Promise<IVerifier | undefined> => {
    return getVerifierCreatedsByAddress([address])
        .then((verifierCreated) => {
            if (verifierCreated.length > 0) {
                return {
                    addr: verifierCreated[0].verifier,
                    name : verifierCreated[0].name,
                    addressName: verifierCreated[0].addressName,
                    siret: verifierCreated[0].siret,
                    approval: verifierCreated[0].approvalNumber
                }
            }
        })
}

export const getProfileAccount = async (address: `0x${string}`): Promise<IProfileAccount> => {
    const company = await getCompanyAccount(address)
    const verifier = await getVerifierAccount(address)

    return {
        isCompany: !!company?.addr,
        company: company,
        isVerifier: !!verifier?.addr,
        verifier: verifier
    } as IProfileAccount
}


export const toasterMessages = (): IToasterMessages => {
    const t = useTranslations('ToasterMessages')
    
    return {
        notConnectedTitle: t('notConnected.title'),
        notConnectedDescription: t('notConnected.description'),
        unauthorizedTitle: t('unauthorized.title'),
        unauthorizedDescription: t('unauthorized.description'),
        subscribeCompanyOkTitle: t('subscribeCompany.ok.title'),
        subscribeCompanyOkDescription: t('subscribeCompany.ok.description'),
        subscribeCompanyErrorTitle: t('subscribeCompany.error.title'),
        subscribeCompanyErrorDescription: t('subscribeCompany.error.description'),
        subscribeVerifierOkTitle: t('subscribeVerifier.ok.title'),
        subscribeVerifierOkDescription: t('subscribeVerifier.ok.description'),
        subscribeVerifierErrorTitle: t('subscribeVerifier.error.title'),
        subscribeVerifierErrorDescription: t('subscribeVerifier.error.description'),
        createVerificationTaskOkTitle: t('createVerificationTask.ok.title'),
        createVerificationTaskOkDescription: t('createVerificationTask.ok.description'),
        createVerificationTaskErrorTitle: t('createVerificationTask.error.title'),
        createVerificationTaskErrorDescription: t('createVerificationTask.error.description'),
        updateVerificationTaskStatusOkTitle: t('updateVerificationTaskStatus.ok.title'),
        updateVerificationTaskStatusOkDescription: t('updateVerificationTaskStatus.ok.description'),
        updateVerificationTaskStatusErrorTitle: t('updateVerificationTaskStatus.error.title'),
        updateVerificationTaskStatusErrorDescription: t('updateVerificationTaskStatus.error.description'),
        addSiteToCompanyOkTitle: t('addSiteToCompany.ok.title'),
        addSiteToCompanyOkDescription: t('addSiteToCompany.ok.description'),
        addSiteToCompanyErrorTitle: t('addSiteToCompany.error.title'),
        addSiteToCompanyErrorDescription: t('addSiteToCompany.error.description'),
    }
}

export const headerFooterIntl = (): IHeaderFooter => {
    const t = useTranslations('HeaderFooter')

    return {
        title: t('title'),
        register: t('register'),
        showRegister: t('showRegister'),
        member: t('member'),
        companySubscription: t('companySubscription'),
        verifierSubscription: t('verifierSubscription'),
        company: t('company'),
        verifier: t('verifier'),
        support: t('support'),
        faq: t('faq'),
        documentation: t('documentation'),
        products: t('products'),
        contact: t('contact'),
        developer: t('developer'),
        helper: t('helper'),
        rights: t('rights'),
        home: t('home')
    }
}

export const indexIntl = (): IIndex => {
    const t = useTranslations('Index')
    return {
        title: t('title'),
    }
}

export const homePagerIntl = (): IHomePager => {
    const t = useTranslations('HomePager')
    return {
        "homePagerTitle": t('homePagerTitle'),
        "homePagerSubtitle1": t('homePagerSubtitle1'),
        "homePagerSubtitle2": t('homePagerSubtitle2'),
        "homePagerSubtitle3": t('homePagerSubtitle3'),
        "subscribe": t('subscribe'),
        "descTitle": t('descTitle'),
        "descSubTitle": t('descSubTitle'),
        "descText1": t('descText1'),
        "descText2": t('descText2'),
        "descText3": t('descText3'),
        "descText4": t('descText4'),
        "descText5": t('descText5'),
        "descText6": t('descText6'),
        "descText7": t('descText7'),
        "moreInfo": t('moreInfo'),
        "cpyTitle": t('cpyTitle'),
        "cpyEnum1": t('cpyEnum1'),
        "cpyEnum2": t('cpyEnum2'),
        "cpyEnum3": t('cpyEnum3'),
        "cpyEnum4": t('cpyEnum4'),
        "cpyEnum5": t('cpyEnum5'),
        "cpyVGPTitle": t('cpyVGPTitle'),
        "cpyVGPEnum1": t('cpyVGPEnum1'),
        "cpyVGPEnum2": t('cpyVGPEnum2'),
        "consultRegisterTitle": t('consultRegisterTitle'),
        "consultRegisterEnum1": t('consultRegisterEnum1'),
        "consultRegisterEnum2": t('consultRegisterEnum2'),
        "consultRegisterButton": t('consultRegisterButton')
    }
}

export const formSubscriptionCompanyIntl = (): IFormSubscriptionCompany => {
    const t = useTranslations('layout.form.subscriptionCompany')
    return {
        title: t('title'),
        description: t('description'),
        name: t('name'),
        address: t('address'),
        siret: t('siret'),
        siteName: t('siteName'),
        siteAddress: t('siteAddress')
    }
}

export const formSubscriptionVerifierIntl = (): IFormSubscriptionVerifier => {
    const t = useTranslations('layout.form.subscriptionVerifier')
    return {
        title: t('title'),
        description: t('description'),
        name: t('name'),
        address: t('address'),
        siret: t('siret'),
        approval: t('approval')
    }
}

export const layoutButtonIntl = (): ILayoutButton => {
    const t = useTranslations('layout.button')
    return {
        validate: t('validate'),
        subscribe: t('subscribe'),
        save: t('save'),
        cancel: t('cancel'),
    }
}

export const layoutEventLogIntl = (): ILayoutEventLog => {
    const t = useTranslations('layout.eventLog')
    return {
        linkTitle: t('linkTitle'),
        blockTitle: t('blockTitle'),
        title: t('title'),
        smartContractAddress: t('smartContractAddress'),
        blockHash: t('blockHash'),
        transactionHash: t('transactionHash'),
        blockNumber: t('blockNumber'),
        publicKeyAddress: t('publicKeyAddress'),
    }
}



export const createVerificationTaskFormIntl = (): ICreateVerificationTaskForm => {
    const t = useTranslations('layout.form.createVerificationTask')

    return {
        title: t('title'),
        selectSite: t('selectSite'),
        selectSector: t('selectSector'),
        selectVerificationType: t('selectVerificationType')
    }
}

export const verificationTaskFiltersIntl = (): IVerificationTaskFilters => {
    const t = useTranslations('layout.grid.verificationTasks.filters')
    let status: string[] = []

    const taskStatusFilters = [
        "pendingApproval",
        "validated",
        "approved",
        "rejected",
        "conditionallyApproved"
    ]
    taskStatusFilters.map((key) => status.push(t(key)) )

    return {
        title: t('title'),
        pendingApproval: t('pendingApproval'),
        validated: t('validated'),
        approved: t('approved'),
        rejected: t('rejected'),
        conditionallyApproved: t('conditionallyApproved'),
        status: status
    }
}

export const verificationTaskEditStatusIntl = (): IVerificationTaskEditStatus => {
    const t = useTranslations('layout.grid.verificationTasks.editStatus')
    let status: string[] = []

    const taskStatusEditAction: ITaskStatusEditAction[] = [
        {action: "validate", id: 1},
        {action: "approve", id: 2},
        {action: "reject", id: 3},
        {action: "conditionallyApprove", id: 4},
    ]
    taskStatusEditAction.map((obj: ITaskStatusEditAction) => {
        status[obj.id] = (t(obj.action))
    })

    return {
        title: t('title'),
        validate: t('validate'),
        approve: t('approve'),
        reject: t('reject'),
        conditionallyApprove: t('conditionallyApprove'),
        status: status
    }
}

export const verificationTaskFinalStatusIntl = (): IVerificationTaskFinalStatus => {
    const t = useTranslations('layout.grid.verificationTasks.finalStatus')
    let status: string[] = []

    const taskStatusFinalStatus: ITaskStatusFinalStatus[] = [
        {action: "approve", id: 2},
        {action: "reject", id: 3},
    ]
    taskStatusFinalStatus.map((obj: ITaskStatusFinalStatus) => {
        status[obj.id] = (t(obj.action))
    })

    return {
        title: t('title'),
        approve: t('approve'),
        reject: t('reject'),
        status: status
    }
}


export const verificationTaskGridIntl = (): IVerificationTaskGrid => {
    const t = useTranslations('layout.grid.verificationTasks.grid')
    const sectorsIntl = useTranslations('layout.grid.verificationTasks.grid.sectors')
    const fieldsGridValuesIntl = useTranslations('layout.grid.verificationTasks.grid.fields.grid.values')
    const fieldsSubGridFirstValuesIntl = useTranslations('layout.grid.verificationTasks.grid.fields.subGridFirst.values')
    const fieldsSubGridSecondValuesIntl = useTranslations('layout.grid.verificationTasks.grid.fields.subGridSecond.values')
    const fieldsSubGridThirdValuesIntl = useTranslations('layout.grid.verificationTasks.grid.fields.subGridThird.values')

    // keys
    const sectorsKeys = ['Ventilation', 'Pressure', 'Elevators', 'Noise', 'Light', 'Electricity', 'Fire', 'Refrigeration', 'Thermal', 'Doors', 'Ionizing', 'Optical', 'Chemical', 'Signaling', 'Air'] as const
    const fieldsGridKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    const fieldsSubGridFirstKeys = ["0", "1", "2", "3", "4", "5", "6"]
    const fieldsSubGridSecondKeys = ["0", "1", "2", "3", "4", "5"]
    const fieldsSubGridThirdKeys = ["0", "1",]

    let sectors: string[] = []
    let fieldsGrid: string[] = []
    let fieldsSubGridFirst: string[] = []
    let fieldsSubGridSecond: string[] = []
    let fieldsSubGridThird: string[] = []

    sectorsKeys.map((key) => sectors.push(sectorsIntl(key)) )
    fieldsGridKeys.map((key) => fieldsGrid.push(fieldsGridValuesIntl(key)) )
    fieldsSubGridFirstKeys.map((key) => fieldsSubGridFirst.push(fieldsSubGridFirstValuesIntl(key)) )
    fieldsSubGridSecondKeys.map((key) => fieldsSubGridSecond.push(fieldsSubGridSecondValuesIntl(key)) )
    fieldsSubGridThirdKeys.map((key) => fieldsSubGridThird.push(fieldsSubGridThirdValuesIntl(key)) )

    return {
        pageTitle: t('pageTitle'),
        searchBar: t('searchBar'),
        createVerificationButton: t('createVerificationButton'),
        sectors: sectors,
        fieldGridTitle: t('fields.grid.title'),
        fieldGridValues: fieldsGrid,
        fieldSubGridFirstTitle: t('fields.subGridFirst.title'),
        fieldSubGridFirstValues: fieldsSubGridFirst,
        fieldSubGridSecondTitle: t('fields.subGridSecond.title'),
        fieldSubGridSecondValues: fieldsSubGridSecond,
        fieldSubGridThirdTitle: t('fields.subGridThird.title'),
        fieldSubGridThirdValues: fieldsSubGridThird,
    }
}

export const generalIntl = (): IGeneral => {
    const t = useTranslations('General')
    const generalProfile: IGeneralProfile[] = [
        {profile: "company", id: 0},
        {profile: "verifier", id: 1},
        {profile: "guest", id: 2},
    ]
    let _profiles: string[] = []
    let _profilesObj: IProfile = {
        company: "",
        verifier: "",
        guest: "",
    }

    generalProfile.map((obj: IGeneralProfile) => {
        _profiles[obj.id] = (t(obj.profile))
        _profilesObj[obj.profile] = (t(obj.profile))
    })

    return {
        previous: t('previous'),
        next: t('next'),
        profile: t('profile'),
        inProgress: t('inProgress'),
        profiles: _profiles,
        profilesObj: _profilesObj,
        selectAction: t('selectAction'),
    }
}

export const companyRootPageIntl = (): ICompanyRootPageIntl => {
    const t = useTranslations('CompanyRootPage')
    return {
        title: t('title'),
    }
}