import Campaign from '../models/campaigns.model.js'
import { campaignContract } from '../config/web3.config.js'
import { bigNumberToInt } from './index.util.js'

export const fetchCampaigns = async (campaignsIds) => {
  // remove duplicates
  campaignsIds = new Set(campaignsIds)
  // sort asc
  campaignsIds = Array.from(campaignsIds).sort((a, b) => a - b)

  const [contractData, dbData] = await Promise.all([
    campaignContract.getCampaignsByIds(campaignsIds),
    Campaign.find({
      campaignId: { $in: campaignsIds }
    }).lean()
    // lean() to get plain JS objects instead of Mongoose Documents (faster)
  ])

  const parsedCampaigns = contractData.map((campaign, i) => {
    return {
      owner: campaign.owner,
      title: campaign.title,
      description: dbData[i]?.desc,
      category: dbData[i]?.category,
      message: dbData[i]?.message,
      target: bigNumberToInt(campaign.target),
      softcap: bigNumberToInt(campaign.softcap),
      amountCollected: bigNumberToInt(campaign.raisedAmount),
      withdrawnAmount: bigNumberToInt(campaign.withdrawnAmount),
      timeStamp: parseInt(campaign.timeStamp),
      rewardTokenId: parseInt(campaign.rewardTokenId),
      status: campaign.isOpen ? 'Open' : 'Closed',
      image: campaign.image,
      pId: i
    }
  })
  return parsedCampaigns
}
