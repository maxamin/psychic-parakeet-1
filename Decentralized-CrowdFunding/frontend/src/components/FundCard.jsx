import React from 'react'
import PropTypes from 'prop-types'

import { tagType, ethereum } from '../assets'
import { formatDate } from '../utils'

const FundCard = ({
  owner,
  title,
  description,
  target,
  category,
  timeStamp,
  status,
  amountCollected,
  image,
  handleClick
}) => {
  const time = formatDate(timeStamp)

  return (
    <div
      className="sm:w-[450px] w-full rounded-[15px] bg-light dark:bg-[#1c1c24] cursor-pointer hover:scale-105"
      onClick={handleClick}
    >
      <img
        src={image}
        alt="fund"
        className="w-full h-[158px] object-cover rounded-[15px]"
      />

      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[18px]">
          <img
            src={tagType}
            alt="tag"
            className="w-[17px] h-[17px] object-contain"
          />
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#6f6f71] dark:text-[#808191]">
            {category}
          </p>
        </div>

        <div className="block">
          <div className="flex justify-between">
            <h3 className="font-epilogue font-semibold text-[16px] dark:text-white text-left leading-[26px] truncate">
              {title}
            </h3>
            <p className="font-epilogue font-normal text-[14px] text-[#6f6f71] dark:text-white truncate">
              {time}
            </p>
          </div>
          <p className="mt-[5px] font-epilogue font-normal text-[#6f6f71] dark:text-[#808191] text-left leading-[18px] truncate">
            {description}
          </p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px]  dark:text-[#b2b3bd] leading-[22px]">
              {amountCollected}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#6f6f71] dark:text-[#808191] sm:max-w-[120px] truncate">
              Raised of {target}
            </p>
          </div>
          <div className="flex flex-col">
            {/* <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">{remainingDays}</h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Days Left</p> */}
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#6f6f71] dark:text-[#808191] sm:max-w-[120px] truncate">
              Status
            </p>
            <h4
              className={`font-epilogue font-semibold text-[15px] leading-[22px] ${
                status === 'Open' ? 'text-primary' : 'text-[#c70039]'
              } `}
            >
              {status}
            </h4>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[7px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
            <img
              src={ethereum}
              alt="user"
              className="w-[70%] h-[70%] object-contain"
            />
          </div>
          <div className="flex-1 flex-col font-epilogue font-normal text-[11px] text-[#6f6f71] dark:text-[#808191] truncate">
            <p className="italic">By</p>
            <span className="font-bold dark:text-[#b2b3bd]">{owner}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

FundCard.propTypes = {
  owner: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  target: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  timeStamp: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  amountCollected: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default FundCard
