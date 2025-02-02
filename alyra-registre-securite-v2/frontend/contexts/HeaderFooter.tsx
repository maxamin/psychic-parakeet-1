"use client"

import { createContext, ReactNode, useContext, useState } from "react"

interface IHeaderFooterProps {
    headerOn: boolean
    setHeaderOn: (headerOn: boolean) => void
    footerOn: boolean
    setFooterOn: (footerOn: boolean) => void
}


const HeaderFooterContext = createContext<IHeaderFooterProps>({
    headerOn: true,
    setHeaderOn: () => true,
    footerOn: true,
    setFooterOn: () => true,
})

export const HeaderFooterContextProvider = ({ children }: { children: ReactNode }) => {
    const [headerOn, setHeaderOn] = useState(true)
    const [footerOn, setFooterOn] = useState(true)

    return (
        <HeaderFooterContext.Provider value={{
            headerOn: headerOn,
            setHeaderOn: setHeaderOn,
            footerOn: footerOn,
            setFooterOn: setFooterOn,
        }}>
            {children}
        </HeaderFooterContext.Provider>
    )
}

export const useHeaderFooterContext = () => useContext(HeaderFooterContext)
