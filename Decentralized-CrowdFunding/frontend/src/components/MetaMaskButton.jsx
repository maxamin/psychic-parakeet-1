import React from 'react'
import { metamask } from '../assets'
import { useStateContext } from '../context'

import PropTypes from 'prop-types'

function MetMaskButton({ styles }) {
  const { connect } = useStateContext()
  return (
    <button
      className={`hover:scale-110 flex w-full select-none justify-center items-center gap-1 rounded-lg dark:bg-gray-800 dark:text-white bg-zinc-300  py-2 px-4 text-center align-middle font-sans text-[15px] font-bold uppercase text-blue-gray-900 shadow-lg shadow-blue-gray-500/10 transition-all hover:shadow-xl hover:shadow-blue-gray-500/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none
      ${styles}`}
      type="button"
      data-ripple-dark="true"
      onClick={connect}
    >
      <img src={metamask} alt="metamask" className="w-10 h-10" />
      Connect Wallet
    </button>
  )
}

MetMaskButton.propTypes = {
  styles: PropTypes.string
}

export default MetMaskButton
