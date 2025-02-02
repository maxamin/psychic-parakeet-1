import React from 'react'

import PropTypes from 'prop-types'

const CountBox = ({ title, value, styles }) => {
  const textStyle = styles?.text

  return (
    <div className="flex flex-col items-center w-[150px]">
      <h4
        className={`font-epilogue font-bold text-[30px] p-3 bg-light dark:bg-[#1c1c24] rounded-t-[10px] w-full text-center break-all 
        text-${textStyle} ${!textStyle && 'dark:text-white'}`}
      >
        {value}
      </h4>
      <p
        className={`font-epilogue font-normal text-[16px] dark:text-[#8d8e99] px-3 py-2 w-full rouned-b-[10px] text-center break-all
        bg-zinc-300 dark:bg-[#28282e]
        `}
      >
        {title}
      </p>
    </div>
  )
}

CountBox.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
  styles: PropTypes.shape({
    text: PropTypes.string
  })
}

export default CountBox
