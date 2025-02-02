/* eslint-disable no-undef */
import { mongooseDisconnect } from '../config/index.config.js'
import logger from '../config/logger.config.js'

let isServerShuttingDown = false

export function gracefulShutdown(app) {
  const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT']

  for (const signal of signals) {
    process.on(signal, () => {
      // Prevent multiple shutdowns
      if (isServerShuttingDown) {
        logger.warn('Server is already shutting down.')
        return
      }

      logger.warn(`${signal} signal received.`)
      isServerShuttingDown = true

      // Close MongoDB connection
      mongooseDisconnect()

      // Close existing connections or wait for them to complete
      app.close(() => {
        logger.info('Server gracefully shut down.')
        process.exit(0)
      })

      // Forcefully shut down server after 10 seconds and if it's still not shut down
      setTimeout(() => {
        logger.warn('Forcing server to shut down.')
        process.exit(1)
      }, 10000)
    })
  }
}

// Middleware to prevent new requests while server is shutting down
export function shutdownMiddleware(req, res, next) {
  if (isServerShuttingDown) {
    res.status(503).send('Server is shutting down.')
  } else {
    next()
  }
}
