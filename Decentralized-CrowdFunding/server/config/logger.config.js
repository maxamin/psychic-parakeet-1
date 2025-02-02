import winston from 'winston'
import { NODE_ENV } from '../constants.js'

const { combine, timestamp, printf } = winston.format

// Define the log format
const productionLogFormat = printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`
})

const devLogFormat = printf((info) => {
  return `${info.level}: ${info.message}`
})

let logger

if (NODE_ENV === 'production') {
  logger = winston.createLogger({
    level: 'info',
    format: combine(
      timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
      productionLogFormat
    ),
    transports: [
      new winston.transports.File({
        filename: './logs/logs.log'
      })
    ]
  })
} else {
  logger = winston.createLogger({
    level: 'info', // info and above types like warn, error, etc. will be logged
    format: combine(winston.format.colorize(), devLogFormat),
    transports: [new winston.transports.Console({})]
  })
}

export default logger
