import asyncHandler from 'express-async-handler'
import express from 'express'
import {
  addCampaign,
  deleteCampaign,
  getCampaigns,
  updateCampaign,
  getUserDonation,
  getUserCampaigns,
  getCampaignById,
  uploadImage
} from '../controllers/campaigns.controller.js'
import { upload } from '../config/index.config.js'

const router = express.Router()

router.get('/', asyncHandler(getCampaigns))
router.post('/', asyncHandler(addCampaign))
router.get('/donations/:campaignId/:address', asyncHandler(getUserDonation))
router.get('/:campaignId', asyncHandler(getCampaignById))
router.get('/profiles/:address', asyncHandler(getUserCampaigns))
router.patch('/:campaignId', asyncHandler(updateCampaign))
router.delete('/:id', asyncHandler(deleteCampaign))
router.post('/uploadImage', upload.single('file'), asyncHandler(uploadImage))

export default router
