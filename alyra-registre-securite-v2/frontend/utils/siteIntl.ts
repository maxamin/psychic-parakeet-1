import { useTranslations } from "next-intl"

export interface IAddSiteToCompanyForm {
    title: string
    titleForButton: string
    siteName: string
    siteAddressName: string
}

export const addSiteToCompanyFormIntl = (): IAddSiteToCompanyForm => {
    const t = useTranslations('layout.form.addSiteToCompany')

    return {
        title: t('title'),
        titleForButton: t('titleForButton'),
        siteName: t('siteName'),
        siteAddressName: t('siteAddressName'),
    }
}
