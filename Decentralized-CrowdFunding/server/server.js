import compression from 'compression'
import mongoose from 'mongoose'
import express from 'express'
import helmet from 'helmet'
import multer from 'multer'
import path from 'path'
import cors from 'cors'
import Joi from 'joi'

import { shutdownMiddleware } from './utils/gracefulShutdown.js'
import { requestLimiter } from './config/index.config.js'
import campaignsRoute from './routes/campaigns.route.js'
import rewardsRoute from './routes/rewards.route.js'
import { formatError } from './utils/index.util.js'
import { NODE_ENV } from './constants.js'
import logger from './config/logger.config.js'

const server = express()
// Middlewares
server.use(shutdownMiddleware) // stop taking requests when shutting down
server.use(helmet())
server.use(cors({ origin: 'http://localhost:5173', credentials: true }))
server.use(express.urlencoded({ extended: true }))
server.use(express.json({ limit: '10mb' }))
server.use(compression())
server.use(express.static(path.resolve('..', 'frontend', 'dist')))

// Routes
server.get('/health-check', (req, res) => {
  res.send('hello, I am good :)')
})
server.use('/api/v1/campaigns', requestLimiter, campaignsRoute)
server.use('/api/v1/rewards', requestLimiter, rewardsRoute)

server.get('/*', (req, res) => {
  res.sendFile(path.resolve('..', 'frontend', 'dist', 'index.html'))
})

server.use((req, res) => {
  res.status(404).send('404: not found')
})

// eslint-disable-next-line no-unused-vars
server.use((error, req, res, next) => {
  let status = error?.statusCode || 500
  let message = formatError(error?.message) || 'Internal server error'

  // mongoose errors
  if (error instanceof mongoose.Error.DocumentNotFoundError) status = 404
  if (error instanceof mongoose.Error.CastError) status = 400
  if (error.code === 11000 && error.name === 'MongoServerError') {
    message = 'Database duplicate key error'
    status = 409
  }
  if (error instanceof mongoose.Error.ValidationError) {
    message = Object.values(error.errors).map((err) => err.message)
    status = 400
  }

  // multer errors
  if (error instanceof multer.MulterError) {
    status = 422
    if (error.code === 'LIMIT_FILE_SIZE') {
      status = 413
      message = 'File too large'
    }
  }

  // joi validation errors
  if (error instanceof Joi.ValidationError) {
    message = error.details.map((detail) => detail.message)
    status = 400
  }

  // ethers errors
  if (
    error.code === 'INVALID_ARGUMENT' ||
    error.code === 'MISSING_ARGUMENT' ||
    error.code === 'UNEXPECTED_ARGUMENT' ||
    error.code === 'INVALID_ADDRESS'
  ) {
    status = 400
  }

  // console.log(message)
  // const message = formatError(error.message)
  const stack = NODE_ENV === 'development' && error?.stack
  if (status == 500) logger.error(error)
  return res.status(status).json({
    success: false,
    status,
    message,
    stack
  })
})

export default server
