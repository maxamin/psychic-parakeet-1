/* eslint-disable no-undef */
import request from 'supertest'

import server from '../server.js'
import { rewardContract } from '../config/web3.config.js'
import { numberToBigNumber } from '../utils/index.util.js'

jest.mock('./../config/web3.config.js', () => {
  return {
    rewardContract: {
      getTokens: jest.fn(),
      getTokensBalances: jest.fn()
    }
  }
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('get rewards', () => {
  // get rewards success
  it('should succeed to get rewards', async () => {
    const resolvedValue = [
      [
        'Funding Points',
        'FP',
        'https://bafybeie2pa7gtnjetomxbywp4o4zeasrhk3dj653b324ddzufsculkwa7i.ipfs.w3s.link/Funding-Points.png'
      ],
      [
        'Supporting Points',
        'SP',
        'https://bafybeifbqmphvoaymvsqfhta74uyiqylvlsh3icg62bszxqepbainclxlu.ipfs.w3s.link/Supporting-Points.png'
      ]
    ]
    const expectedRewardTokens = [
      {
        name: 'Funding Points',
        symbol: 'FP',
        uri: 'https://bafybeie2pa7gtnjetomxbywp4o4zeasrhk3dj653b324ddzufsculkwa7i.ipfs.w3s.link/Funding-Points.png'
      },
      {
        name: 'Supporting Points',
        symbol: 'SP',
        uri: 'https://bafybeifbqmphvoaymvsqfhta74uyiqylvlsh3icg62bszxqepbainclxlu.ipfs.w3s.link/Supporting-Points.png'
      }
    ]
    rewardContract.getTokens.mockResolvedValueOnce(resolvedValue)
    expect(jest.isMockFunction(rewardContract.getTokens)).toBe(true)

    const res = await request(server).get('/api/v1/rewards/')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(expectedRewardTokens)
  })
})

describe('get user rewards', () => {
  // get rewards success
  it('should succeed to get user rewards', async () => {
    const resolvedValue = [numberToBigNumber(100), numberToBigNumber(200)]
    const expectedUserRewards = [100, 200]
    rewardContract.getTokensBalances.mockResolvedValueOnce(resolvedValue)
    expect(jest.isMockFunction(rewardContract.getTokensBalances)).toBe(true)

    const address = '0xBC91d2B233c0747d1EFD8EAB08bCfca7783b9c96'
    const res = await request(server).get(`/api/v1/rewards/profiles/${address}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(expectedUserRewards)
  })

  // get rewards failure if invalid input
  it('should fail to get user rewards if `address` input is invalid', async () => {
    const addresses = [0, 'string', '0xBC91d2B233c0747', null, undefined]
    for (const address of addresses) {
      const res = await request(server).get(
        `/api/v1/rewards/profiles/${address}`
      )
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toEqual([
        `"address" with value "${address}" fails to match the Ethereum address pattern`
      ])
    }
  })
})
