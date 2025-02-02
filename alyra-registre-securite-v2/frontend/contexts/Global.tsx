"use client"

import { createContext, ReactNode, useContext, useState } from "react"

interface IGlobalContext {
    reloadPage: boolean
    setReloadPage: (reloadPage: boolean) => void
}


const GlobalContext = createContext<IGlobalContext>({
    reloadPage: false,
    setReloadPage: () => false,
})

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
    const [reloadPage, setReloadPage] = useState(false)

    return (
        <GlobalContext.Provider value={{
            reloadPage: reloadPage,
            setReloadPage: setReloadPage,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)
