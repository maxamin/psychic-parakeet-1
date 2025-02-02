import React from 'react'

import { useFetch } from '../hooks'
import { DisplayCampaigns, UserRewards } from '../components'
import { useStateContext } from '../context'

const Profile = () => {
  const { address } = useStateContext()

  const { data: campaigns, loading: isCampaignsLoading } = useFetch(
    `http://localhost:8000/api/v1/campaigns/profiles/${address}`,
    {},
    [address]
  )

  return (
    <>
      {address ? (
        <div>
          <h1 className="font-epilogue font-semibold text-[30px] mb-5 text-[#30c97f] uppercase">
            Your Profile:
          </h1>
          <div className="flex items-center mb-5 break-all">
            <h4 className="font-epilogue text-[15px] dark:text-white">
              {address}
            </h4>
            <UserRewards address={address} />
          </div>
          <DisplayCampaigns
            title="Campaigns You contributed in:"
            isLoading={isCampaignsLoading}
            campaigns={campaigns}
            campaignsCount={campaigns?.length}
          />
        </div>
      ) : (
        <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
          Nothing to show
        </p>
      )}
    </>
  )
}

export default Profile
