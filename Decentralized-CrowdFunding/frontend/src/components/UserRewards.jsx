import React from 'react'
import { useFetch } from '../hooks'

import PropTypes from 'prop-types'

function UserRewards({ address }) {
  const { data: rewardTokens } = useFetch(
    'http://localhost:8000/api/v1/rewards/'
  )

  const { data: userRewardsBalances } = useFetch(
    `http://localhost:8000/api/v1/rewards/profiles/${address}/`,
    {},
    [address]
  )
  return (
    <>
      {userRewardsBalances?.map((userBalance, i) => {
        if (userBalance > 0)
          return (
            <div key={i} className="relative flex group">
              <img
                src={rewardTokens[i]?.uri}
                alt={rewardTokens[i]?.name}
                className="w-[30px] h-[35px] ml-1 cursor-pointer hover:scale-105"
              />
              <span className="absolute right-0 transition-opacity opacity-0 pointer-events-none dark:text-white -top-7 w-max sm:group-hover:opacity-100">
                {userBalance} {rewardTokens[i]?.name}
              </span>
            </div>
          )
      })}
    </>
  )
}

UserRewards.propTypes = {
  address: PropTypes.string
}

export default UserRewards
