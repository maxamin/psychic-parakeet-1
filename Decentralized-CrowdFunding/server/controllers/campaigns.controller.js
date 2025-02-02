import Campaign from '../models/campaigns.model.js'
import JoiValidate from '../utils/JoiValidate.js'
import { File } from 'web3.storage'

import { campaignContract, web3Client } from '../config/web3.config.js'
import { fetchCampaigns } from '../utils/campaigns.util.js'
import {
  mongoIdSchema,
  ethAdressSchema,
  objectSchema
} from '../validators/index.validator.js'
import {
  campaignCreationSchema,
  campaignQuerySchema,
  campaignIdSchema,
  campaignUpdateSchema
} from '../validators/campaigns.validator.js'
import { bigNumberToInt } from '../utils/index.util.js'

// POST /api/v1/campaigns/
export const addCampaign = async (req, res) => {
  const validatedBody = JoiValidate(campaignCreationSchema, req.body)
  const newCampaign = new Campaign(validatedBody)
  const savedCampaign = await newCampaign.save()
  res.status(201).json(savedCampaign)
}

// PATCH /api/v1/campaigns/:campaignid
export const updateCampaign = async (req, res) => {
  const { campaignId } = JoiValidate(campaignIdSchema, {
    campaignId: req.params.campaignId
  })
  const validatedBody = JoiValidate(campaignUpdateSchema, req.body)
  const updatedCampaign = await Campaign.findOneAndUpdate(
    { campaignId },
    { $set: validatedBody },
    { new: true }
  )
  // const updatedCampaign = await Campaign.findByIdAndUpdate(
  //   id,
  //   { $set: validatedBody },
  //   { new: true }
  // )

  res.status(200).json(updatedCampaign)
}

// DELETE /api/v1/campaigns/:id
export const deleteCampaign = async (req, res) => {
  const reqId = req.params.id
  const { id } = JoiValidate(mongoIdSchema, { id: reqId })

  await Campaign.findByIdAndDelete(id)
  res.status(200).json({ message: 'Campaign deleted successfully' })
}

// GET /api/v1/campaigns/
export const getCampaigns = async (req, res) => {
  const { q } = JoiValidate(campaignQuerySchema, req.query)
  const query = q.trim().replace(/\s+/g, ' ') // remove extra spaces for better search

  const ids = await Campaign.find({
    $or: [
      { desc: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } },
      { message: { $regex: query, $options: 'i' } }
    ]
  })
    .select('campaignId -_id')
    .lean()
  const campaignsIds = ids.map((item) => item.campaignId)
  const campaigns = await fetchCampaigns(campaignsIds)
  res.status(200).json(campaigns)
}

// GET /api/v1/campaigns/profiles/:address
export const getUserCampaigns = async (req, res) => {
  const reqAddress = req.params.address
  const { address } = JoiValidate(ethAdressSchema, { address: reqAddress })
  const filter = campaignContract.filters.Funded(
    null,
    null,
    null,
    address,
    null
  )
  const events = await campaignContract.queryFilter(filter)
  const campaignsIds = events.map((event) => parseInt(event.args.campaignId))

  const campaigns = await fetchCampaigns(campaignsIds)
  res.status(200).json(campaigns)
}

// GET /api/v1/donations/:campaignId/:address
export const getUserDonation = async (req, res) => {
  const { campaignId } = JoiValidate(campaignIdSchema, {
    campaignId: req.params.campaignId
  })
  const { address } = JoiValidate(ethAdressSchema, {
    address: req.params.address
  })

  const donation = await campaignContract.fundersContributions(
    campaignId,
    address
  )
  res.status(200).json(bigNumberToInt(donation))
}

// GET /api/v1/campaigns/:campaignId
export const getCampaignById = async (req, res) => {
  const { campaignId } = JoiValidate(campaignIdSchema, {
    campaignId: req.params.campaignId
  })

  const campaign = await fetchCampaigns([campaignId])
  const filter = campaignContract.filters.Funded(
    campaignId,
    null,
    null,
    null,
    null
  )
  const events = await campaignContract.queryFilter(filter)

  const donations = events.map((event) => ({
    funder: event.args.funder,
    fundedAmount: bigNumberToInt(event.args.fundedAmount)
  }))
  // console.log(events)
  res.status(200).json({ ...campaign[0], donations })
}

// POST /api/v1/campaigns/uploadImage
export const uploadImage = async (req, res) => {
  JoiValidate(objectSchema, { object: req.file })

  const web3StorageFile = new File([req.file.buffer], req.file.originalname)
  const cid = await web3Client.put([web3StorageFile])

  const encodedImageName = encodeURIComponent(req.file.originalname)
  const imageUrl = `http://${cid}.ipfs.dweb.link/${encodedImageName}`

  res.status(200).json(imageUrl)
}
