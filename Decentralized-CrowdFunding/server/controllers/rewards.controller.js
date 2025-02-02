import { rewardContract } from '../config/web3.config.js'
import { ethAdressSchema } from '../validators/index.validator.js'
import JoiValidate from '../utils/JoiValidate.js'
import { bigNumberToInt } from '../utils/index.util.js'

class Token {
  constructor(name, symbol, uri) {
    this.name = name
    this.symbol = symbol
    this.uri = uri
  }
}

// GET /api/v1/rewards/
export const getRewards = async (req, res) => {
  const tokens = await rewardContract.getTokens()
  const tokensInJson = tokens.map(
    (token) => new Token(token[0], token[1], token[2])
  )
  res.status(200).json(tokensInJson)
}

// GET /api/v1/rewards/profiles/:address
export const getUserRewards = async (req, res) => {
  const reqAddress = req.params.address
  const { address } = JoiValidate(ethAdressSchema, { address: reqAddress })

  const tokensBalances = await rewardContract.getTokensBalances(address)
  const tokensBalancesIntParsed = tokensBalances.map((balance) =>
    bigNumberToInt(balance)
  )
  res.status(200).json(tokensBalancesIntParsed)
}
