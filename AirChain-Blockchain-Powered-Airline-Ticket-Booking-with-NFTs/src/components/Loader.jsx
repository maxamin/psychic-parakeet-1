import React from 'react'

function Loader({ minting }) {
  if (minting) {
    return (
      <div className='flex items-center justify-center  p-10'>
        <img className='w-[50px]' src="./spinner.gif"></img>
      </div>
    )
  }
  return (
    <div className='flex w-full items-center justify-center h-full p-10'>
      <img src="./spinner.gif"></img>
    </div>
  )
}

export default Loader