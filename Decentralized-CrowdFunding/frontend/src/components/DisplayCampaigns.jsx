import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import FundCard from './FundCard'
import { loader } from '../assets'

const DisplayCampaigns = ({ title, isLoading, campaigns, campaignsCount }) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      <h2 className="font-epilogue font-semibold text-[20px] dark:text-white text-left">
        {title} ({campaignsCount})
      </h2>
      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && campaigns?.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] dark:text-[#818183]">
            No campigns to show
          </p>
        )}

        {!isLoading &&
          campaigns?.length > 0 &&
          campaigns.map((campaign) => (
            <FundCard
              key={campaign.pId}
              {...campaign}
              handleClick={() =>
                navigate(
                  `/campaign-details/${campaign.pId}/${encodeURIComponent(
                    campaign.title
                  )}`
                )
              }
            />
          ))}
      </div>
    </div>
  )
}

DisplayCampaigns.propTypes = {
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  campaigns: PropTypes.array,
  campaignsCount: PropTypes.number
}

export default DisplayCampaigns
