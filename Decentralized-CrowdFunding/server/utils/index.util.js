import { parseEther } from 'ethers/lib/utils.js'

export function bigNumberToInt(bigNumber) {
  return parseInt(bigNumber / 1e18)
}

export function numberToBigNumber(number) {
  return parseEther(number?.toString())
}

export function formatError(errorMessage) {
  const match = errorMessage?.match(
    /Error: VM Exception while processing transaction: reverted with reason string '(.+?)'/
  )
  if (!match) return errorMessage
  const formatedMessage = match[1]
  return formatedMessage
}
