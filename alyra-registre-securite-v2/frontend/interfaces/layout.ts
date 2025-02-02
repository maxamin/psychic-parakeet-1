import React from "react";

export interface IButtonLink {
    title: string
    href: string | object
    minWidth?: string
}

export interface ISubmitButtonLayout {
    loading: boolean
    spinnerSize?: string
    buttonName?: string
    loadingName?: string
    onClick?: () => void
    height? : string
    width? : string
    rounded?: string
    disabled?: boolean
}

export interface IFormLayout {
    title: string
    onSubmit: (e: React.FormEvent) => void
    description?: string
    onModalClose?: () => void
    message?: string
    messageLevel?: string
}

export interface IBlockQuote {
    message: string
    level: string
}

export interface IFormInputLayout {
    id: string
    label: string
    placeholder: string
    autoComplete: string
}
export interface IFormInputLayout2 {
    id: string
    label: string
    placeholder: string
    autoComplete: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface IFormSelectLayout {
    id: string
    label?: string
    selected: IValueLabelId
    data: IValueLabelId[]
    onChange: (e: React.ChangeEvent<HTMLSelectElement>, data?: any) => void
    onBlur?: () => void
    inline?: boolean
    defaultSelected?: IValueLabelId
}

export interface IEventFieldLayout {
    title: string
    value: string | `0x${string}` | null | undefined
    border?: boolean
}

export interface IEventLog {
    blockTitle: string
    blockData: IEventFieldLayout[],
    title: string
    data: IEventFieldLayout[]
}


export interface IEventLogLayout {
    title: string
    description: string
    events: IEventLog | undefined
}

export interface IhandleEventsResponse {
    eventLog: IEventLog | undefined
    ok: boolean
}

export interface ILayoutEventLogMapping {
    addressAttribute: string
    addressValue: `0x${string}`
}