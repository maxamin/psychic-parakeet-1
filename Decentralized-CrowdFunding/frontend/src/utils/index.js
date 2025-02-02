import moment from 'moment'
import Joi from 'joi'

export const calculatePercentage = (full, partial) => {
  const percentage = Math.round((partial * 100) / full)

  return percentage
}

export function formatDate(timeStamp) {
  return moment.unix(timeStamp).fromNow()
}

export function formatError(error) {
  console.error(error)
  const maxErrorMessageLength = 200
  let errorMessage = error?.message

  const JoiError = error instanceof Joi.ValidationError
  const contractError = errorMessage?.match(
    /"Error: VM Exception while processing transaction: reverted with reason string '(.+?)'"/
  )
  const metamaskError = errorMessage?.startsWith('[ethjs-query]')
  if (!errorMessage) return 'Something went wrong!'
  else if (contractError) {
    errorMessage = contractError[1]
  } else if (metamaskError) {
    const startIndex = errorMessage?.indexOf('{')
    const endIndex = errorMessage?.lastIndexOf('}') + 1
    const rpcErrorMessage = errorMessage?.substring(startIndex, endIndex)
    const errorObj = JSON?.parse(rpcErrorMessage)
    const message = errorObj?.value.data?.message
    errorMessage = message
  } else if (JoiError) {
    const messages = error.details.map((detail) => detail.message)
    const formattedMessage = messages.join('\n')
    errorMessage = formattedMessage
  }

  if (errorMessage.length > maxErrorMessageLength)
    return errorMessage.substring(0, maxErrorMessageLength) + '...'

  return errorMessage
}

export function JoiValidate(schema, body) {
  const { error, value } = schema.validate(body, { abortEarly: false })
  if (error) throw new Joi.ValidationError(error.message, error.details, error)

  return value
}
