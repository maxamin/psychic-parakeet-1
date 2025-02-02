import { ethers } from 'ethers'
import { Web3Storage } from 'web3.storage'

import {
  CAMPAIGN_CONTRACT_ADDRESS,
  CAMPAIGN_CONTRACT_ABI,
  REWARD_CONTRACT_ADDRESS,
  REWARD_CONTRACT_ABI,
  JSON_RPC_ETHEREUM_PROVIDER,
  WEB3_STORAGE_TOKEN
} from '../constants.js'

const provider = new ethers.providers.JsonRpcProvider(
  JSON_RPC_ETHEREUM_PROVIDER
)

export const campaignContract = new ethers.Contract(
  CAMPAIGN_CONTRACT_ADDRESS,
  CAMPAIGN_CONTRACT_ABI,
  provider
)
export const rewardContract = new ethers.Contract(
  REWARD_CONTRACT_ADDRESS,
  REWARD_CONTRACT_ABI,
  provider
)

export const web3Client = new Web3Storage({
  token: WEB3_STORAGE_TOKEN
})
