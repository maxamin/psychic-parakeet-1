import React, { useContext, createContext, useState } from 'react'
import PropTypes from 'prop-types' // import PropTypes
import { CAMPAIGN_CONTRACT_ADDRESS, CAMPAIGN_CONTRACT_ABI } from '../constants'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { formatError } from '../utils'

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
  const [address, setAddress] = useState()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [theme, setTheme] = useState(localStorage.theme)

  function toggleDarkMode() {
    if (theme !== 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setTheme('dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', '')
      setTheme('')
    }
  }

  function connect() {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          setAddress(accounts[0])
        })
        .catch((error) => toast.error(formatError(error)))
    } else {
      // Handle the case where the user doesn't have MetaMask installed
      console.error('Please install MetaMask!')
      window.open('https://metamask.io/download/', '_blank') // open in a new tab
    }
  }

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider?.getSigner()
    signer
      ?.getAddress()
      .then((result) => setAddress(result))
      .catch(console.log)

    window.ethereum.on('accountsChanged', (accounts) => {
      setAddress(accounts[0])
    })

    const campaignContract = new ethers.Contract(
      CAMPAIGN_CONTRACT_ADDRESS,
      CAMPAIGN_CONTRACT_ABI,
      provider
    )

    return (
      <StateContext.Provider
        value={{
          signer,
          address,
          campaignContract,
          theme,
          searchQuery,
          page,
          setPage,
          setSearchQuery,
          connect,
          toggleDarkMode
        }}
      >
        {children}
      </StateContext.Provider>
    )
  } else {
    return (
      <StateContext.Provider
        value={{
          signer: null,
          address: null,
          campaignContract: null,
          theme,
          searchQuery,
          page,
          setPage,
          setSearchQuery,
          connect,
          toggleDarkMode
        }}
      >
        {children}
      </StateContext.Provider>
    )
  }
}

StateContextProvider.propTypes = {
  children: PropTypes.node.isRequired // add prop validation for children
}

export const useStateContext = () => useContext(StateContext)
