/* eslint-disable no-undef */
import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { jest } from '@jest/globals'

import server from '../server.js'
import Campaign from '../models/campaigns.model.js'
import { fetchCampaigns } from '../utils/campaigns.util.js'
import { campaignContract } from '../config/web3.config.js'
import { numberToBigNumber } from '../utils/index.util.js'

// write the full path including this prefix `./` to avoid jest error
jest.mock('./../config/web3.config.js', () => {
  return {
    campaignContract: {
      getCampaignsByIds: jest.fn(),
      queryFilter: jest.fn(),
      filters: {
        Funded: jest.fn()
      }
    }
  }
})

let mongo
beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()

  mongoose.set('strictQuery', false)
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

let id
let mockCampaignId
beforeEach(async () => {
  await Campaign.deleteMany({})
  jest.clearAllMocks()

  // campaigns to be used in tests
  const [campaign1, campaign2] = await Promise.all([
    request(server).post('/api/v1/campaigns/').send({
      campaignId: 0,
      desc: 't',
      category: 't',
      message: 't'
    }),
    request(server).post('/api/v1/campaigns/').send({
      campaignId: 1,
      desc: 's',
      category: 's',
      message: 's'
    })
  ])

  expect(campaign1.statusCode).toEqual(201)
  expect(campaign2.statusCode).toEqual(201)
  id = campaign1.body._id
  mockCampaignId = campaign1.body.campaignId
})

afterAll(async () => {
  await Campaign.deleteMany({})
  mongoose.connection.close()
  await mongo.stop()
})

describe('add campaign', () => {
  // add success
  it('should succeed to add campaign', async () => {
    const res = await request(server).post('/api/v1/campaigns/').send({
      campaignId: 100,
      desc: 'test',
      category: 'test cat',
      featured: false
    })

    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('campaignId')
    expect(res.body.desc).toEqual('test')
  })

  // Joi correction success
  it('should succeed to add campaign even if campaiginId is String', async () => {
    const res = await request(server)
      .post('/api/v1/campaigns/')
      .send({
        campaignId: `${100}`,
        desc: 'test',
        category: 'test cat'
      })
    expect(res.statusCode).toEqual(201)
  })

  // `campaignId` failure
  it('should fail to add campaign if campaignId is invalid', async () => {
    const campaignIds = [11, 5.5, -1, '', undefined, null]
    for (const campaignId of campaignIds) {
      const res = await request(server).post('/api/v1/campaigns/').send({
        campaignId,
        desc: 'test',
        category: 'test cat'
      })
      if (campaignId === 11) {
        const res2 = await request(server).post('/api/v1/campaigns/').send({
          campaignId,
          desc: 'test',
          category: 'test cat'
        })
        expect(res.statusCode).toEqual(201)
        expect(res2.statusCode).toEqual(409)
        expect(res2.body.message).toEqual('Database duplicate key error')
      } else if (campaignId === 5.5) {
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(['"campaignId" must be an integer'])
      } else if (campaignId === -1) {
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual([
          '"campaignId" must be greater than or equal to 0'
        ])
      } else if (campaignId === '' || campaignId === null) {
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(['"campaignId" must be a number'])
      } else if (campaignId === undefined) {
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(['"campaignId" is required'])
      }
    }
  })

  // `desc` failure
  it('should fail to add campaign if desc is invalid', async () => {
    const descs = [1, '', undefined, null]
    for (const desc of descs) {
      const res = await request(server).post('/api/v1/campaigns/').send({
        campaignId: 1,
        desc: descs,
        category: 'test cat'
      })
      if (desc === 1 || desc === null || desc === '' || desc === undefined) {
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(['"desc" must be a string'])
      }
    }
  })

  // `category` failure
  it('should fail to add campaign if category is invalid', async () => {
    const categories = [1, '', undefined, null]
    for (const category of categories) {
      const res = await request(server).post('/api/v1/campaigns/').send({
        campaignId: 1,
        desc: 'test',
        category
      })
      if (category === 1 || category === null) {
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(['"category" must be a string'])
      } else if (category === '') {
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual([
          '"category" is not allowed to be empty'
        ])
      } else if (category === undefined) {
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(['"category" is required'])
      }
    }
  })

  // `featured` failure and success
  it('should fail to add campaign if featured is invalid and succeed if undefined', async () => {
    const featuredVals = [5, 'string', null, undefined]
    for (const featured of featuredVals) {
      const res = await request(server).post('/api/v1/campaigns/').send({
        campaignId: 100,
        desc: 'test',
        category: 'test cat',
        featured
      })
      if (featured === 5 || featured === 'string' || featured === null) {
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(['"featured" must be a boolean'])
      } else if (featured === undefined) {
        expect(res.statusCode).toEqual(201)
      }
    }
  })

  // `message` failure and success
  it('should fail to add campaign if message is invalid and succeed if undefined', async () => {
    const messages = [1, '', null, undefined]
    for (const message of messages) {
      const res = await request(server).post('/api/v1/campaigns/').send({
        campaignId: 3,
        desc: 'test',
        category: 'test cat',
        message
      })
      if (message === 1 || message === null) {
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(['"message" must be a string'])
      } else if (message === '') {
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual([
          '"message" is not allowed to be empty'
        ])
      } else if (message === undefined) {
        expect(res.statusCode).toEqual(201)
      }
    }
  })

  // many error messages
  it('should fail to add campaign if there are many validation errors and sends the messages', async () => {
    const res = await request(server).post('/api/v1/campaigns/').send({
      _id: '',
      campaignId: '',
      desc: '',
      category: ''
    })
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual([
      '"campaignId" must be a number',
      '"desc" is not allowed to be empty',
      '"category" is not allowed to be empty',
      '"_id" is not allowed'
    ])
  })
})

describe('update campaign', () => {
  // update success
  it('should succeed to update campaign', async () => {
    const res = await request(server)
      .patch(`/api/v1/campaigns/${mockCampaignId}`)
      .send({
        desc: 'test',
        category: 'test cat',
        message: 'test message',
        featured: true
      })
    expect(res.statusCode).toEqual(200)
  })
  // `desc`, `category`, `message`, `featured` success
  it('should succeed to update campaign if desc, category, message, or feature are undefiend', async () => {
    const res = await request(server)
      .patch(`/api/v1/campaigns/${mockCampaignId}`)
      .send({
        desc: undefined,
        category: undefined,
        message: undefined,
        featured: undefined
      })
    expect(res.statusCode).toEqual(200)
  })

  // immutable fields (`campaignId`, `_id`) updating failure
  it('should fail to update campaign if campaignId or _id was inputted', async () => {
    const immutableFields = ['campaignId', '_id']

    for (const field of immutableFields) {
      const res = await request(server)
        .patch(`/api/v1/campaigns/${mockCampaignId}`)
        .send({
          [field]: 100
        })
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toEqual([`"${field}" is not allowed`])
    }
  })
  // `desc`, `category`, `message`, `featured` failure
  it('should fail to update campaign if desc, category, message, or feature are invalid', async () => {
    const fields = ['desc', 'category', 'message', 'featured']
    for (const field of fields) {
      const res = await request(server)
        .patch(`/api/v1/campaigns/${mockCampaignId}`)
        .send({
          [field]: 100
        })
      expect(res.statusCode).toEqual(400)
      if (field === 'featured') {
        expect(res.body.message).toEqual([`"${field}" must be a boolean`])
      } else expect(res.body.message).toEqual([`"${field}" must be a string`])
    }
  })
})

describe('delete campaign', () => {
  // delete success
  it('should succeed to delete campaign', async () => {
    const res = await request(server).delete(`/api/v1/campaigns/${id}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('Campaign deleted successfully')
  })

  // delete failure
  it('should fail to delete campaign if id is invalid', async () => {
    const ids = [1, 'invalid', null, undefined]
    for (const id of ids) {
      const res = await request(server).delete(`/api/v1/campaigns/${id}`)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toEqual([
        `"id" with value "${id}" fails to match the database ID pattern`
      ])
    }
  })
})

const expectedFetchedCampaigns = [
  {
    owner: '0x0000',
    title: 'title',
    description: 't',
    category: 't',
    message: 't',
    rewardTokenId: 1,
    target: 100,
    timeStamp: 100,
    status: 'Open',
    amountCollected: 0,
    softcap: 10,
    withdrawnAmount: 0,
    image: 'image',
    pId: 0
  },
  {
    owner: '0x0000',
    title: 'title',
    description: 's',
    category: 's',
    message: 's',
    rewardTokenId: 1,
    target: 100,
    timeStamp: 100,
    status: 'Open',
    amountCollected: 0,
    softcap: 10,
    withdrawnAmount: 0,
    image: 'image',
    pId: 1
  }
]

const contractData = [
  {
    owner: '0x0000',
    title: 'title',
    rewardTokenId: 1,
    target: numberToBigNumber(100),
    softcap: numberToBigNumber(10),
    withdrawnAmount: numberToBigNumber(0),
    raisedAmount: numberToBigNumber(0),
    timeStamp: 100,
    isOpen: true,
    image: 'image'
  },
  {
    owner: '0x0000',
    title: 'title',
    rewardTokenId: 1,
    target: numberToBigNumber(100),
    softcap: numberToBigNumber(10),
    withdrawnAmount: numberToBigNumber(0),
    raisedAmount: numberToBigNumber(0),
    timeStamp: 100,
    isOpen: true,
    image: 'image'
  }
]

describe('get campaigns', () => {
  // `fetchCampaigns()` success
  it('should return parsed campaigns data', async () => {
    // use the original implementation of fetchCampaigns()
    // const unMockedFetchCampaigns = jest.requireActual(
    //   './../services/fetchCampaigns.js'
    // ).fetchCampaigns

    campaignContract.getCampaignsByIds.mockResolvedValueOnce(contractData)
    const campaignsIds = [0, 1]
    const fetchedCampaigns = await fetchCampaigns(campaignsIds)
    // Verify that campaignContract.getCampaignsByIds() was called with the expected arguments
    expect(campaignContract.getCampaignsByIds).toHaveBeenCalledWith(
      campaignsIds
    )
    expect(jest.isMockFunction(campaignContract.getCampaignsByIds)).toBe(true)
    expect(fetchedCampaigns).toEqual(expectedFetchedCampaigns)
  })

  // get campaigns success
  it('should succeed to get campaigns', async () => {
    campaignContract.getCampaignsByIds.mockResolvedValueOnce(contractData)
    const res = await request(server).get('/api/v1/campaigns/')

    expect(jest.isMockFunction(campaignContract.getCampaignsByIds)).toBe(true)
    expect(campaignContract.getCampaignsByIds).toHaveBeenCalled()
    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toEqual(2)
    expect(res.body).toEqual(expectedFetchedCampaigns)
  })
  // get campaigns success with query
  it('should succeed to get campaigns with query', async () => {
    campaignContract.getCampaignsByIds.mockResolvedValueOnce([contractData[0]])

    const query = 't'
    const res = await request(server).get(`/api/v1/campaigns?q=${query}`)
    expect(jest.isMockFunction(campaignContract.getCampaignsByIds)).toBe(true)
    expect(campaignContract.getCampaignsByIds).toHaveBeenCalled()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual([expectedFetchedCampaigns[0]])
  })
})

describe('get user campaigns', () => {
  // get user campaigns success
  it('should succeed to get user campaigns', async () => {
    const mockedEvents = [
      {
        args: {
          campaignId: 0
        }
      },
      {
        args: {
          campaignId: 1
        }
      }
    ]

    campaignContract.getCampaignsByIds.mockResolvedValueOnce(contractData)
    campaignContract.queryFilter.mockResolvedValueOnce(mockedEvents)

    const address = '0x90FC0c860F75Df4e193E30753fB9875BF5Dc99c5'
    const res = await request(server).get(
      `/api/v1/campaigns/profiles/${address}`
    )

    expect(jest.isMockFunction(campaignContract.getCampaignsByIds)).toBe(true)
    expect(jest.isMockFunction(campaignContract.queryFilter)).toBe(true)
    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toEqual(2)
    expect(res.body).toEqual(expectedFetchedCampaigns)
  })

  // get user campaigns failure if invalid input
  it('should fail to get user campaigns if address is invalid', async () => {
    const addresses = [0, 'string', '0xBC91d2B233c0747', null, undefined]
    for (const address of addresses) {
      const res = await request(server).get(
        `/api/v1/campaigns/profiles/${address}`
      )
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toEqual([
        `"address" with value "${address}" fails to match the Ethereum address pattern`
      ])
    }
  })
})

describe('get campaign by id', () => {
  // get campaign by id success
  it('should succeed to get campaign by id', async () => {
    const mockedEvents = [
      {
        args: {
          funder: '0x75BF90FC0c860F75Df4e193E30753fB985Dc99c5',
          fundedAmount: 3 * 10 ** 18
        }
      },
      {
        args: {
          funder: '0x50FC0c860F74Df4e113E30753fB9875BF5Dc4444',
          fundedAmount: 2.2 * 10 ** 18
        }
      }
    ]
    const donations = [
      {
        funder: '0x75BF90FC0c860F75Df4e193E30753fB985Dc99c5',
        fundedAmount: 3
      },
      {
        funder: '0x50FC0c860F74Df4e113E30753fB9875BF5Dc4444',
        fundedAmount: 2
      }
    ]
    campaignContract.getCampaignsByIds.mockResolvedValueOnce([contractData[0]])
    campaignContract.queryFilter.mockResolvedValueOnce(mockedEvents)

    const campaignId = 0
    const res = await request(server).get(`/api/v1/campaigns/${campaignId}`)

    const campaignWithDonations = {
      ...expectedFetchedCampaigns[0],
      donations
    }
    expect(jest.isMockFunction(campaignContract.getCampaignsByIds)).toBe(true)
    expect(jest.isMockFunction(campaignContract.queryFilter)).toBe(true)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(campaignWithDonations)
  })

  // get campaign by id failure
  it('should fail to get campaign by id if campaignId is invalid', async () => {
    const campaignIds = [-1, 1.1, 'invalid', null, undefined]
    for (const campaignId of campaignIds) {
      const res = await request(server).get(`/api/v1/campaigns/${campaignId}`)
      expect(res.statusCode).toEqual(400)

      if (campaignId === 1.1) {
        expect(res.body.message).toEqual(['"campaignId" must be an integer'])
      } else if (campaignId === -1) {
        expect(res.body.message).toEqual([
          '"campaignId" must be greater than or equal to 0'
        ])
      } else if (
        campaignId === 'invalid' ||
        campaignId === null ||
        campaignId === undefined
      ) {
        expect(res.body.message).toEqual(['"campaignId" must be a number'])
      }
    }
  })
})
