import asyncHandler from 'express-async-handler'
import express from 'express'

import {
  getRewards,
  getUserRewards
} from '../controllers/rewards.controller.js'

const router = express.Router()

router.get('/', asyncHandler(getRewards))
router.get('/profiles/:address', asyncHandler(getUserRewards))

export default router
