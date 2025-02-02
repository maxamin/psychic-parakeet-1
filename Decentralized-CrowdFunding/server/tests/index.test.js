/* eslint-disable no-undef */
import { jest } from '@jest/globals'
import request from 'supertest'
import { web3Client } from '../config/web3.config.js'
import server from '../server.js'

// write the full path including this prefix `./`
jest.mock('./../config/web3.config.js', () => {
  return {
    web3Client: {
      put: jest.fn()
    }
  }
})

describe('upload image to IPFS', () => {
  // upload image to ipfs sucess
  it('should success and return img url', async () => {
    web3Client.put.mockResolvedValueOnce(
      'QmZ9QXc1Z5b8sZ7G7Qn5Z6Q1X8sZ7G7Qn5Z6Q1X'
    )

    const res = await request(server)
      .post('/api/v1/campaigns/uploadImage')
      .attach('file', './tests/media/image1.jpeg')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      'http://QmZ9QXc1Z5b8sZ7G7Qn5Z6Q1X8sZ7G7Qn5Z6Q1X.ipfs.dweb.link/image1.jpeg'
    )
  })
  // upload image to ipfs failure (no image)
  it('should fail if no image is provided', async () => {
    web3Client.put.mockResolvedValueOnce(
      'QmZ9QXc1Z5b8sZ7G7Qn5Z6Q1X8sZ7G7Qn5Z6Q1X'
    )

    const res = await request(server).post('/api/v1/campaigns/uploadImage')

    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual(['invalid input'])
  })

  // upload image to ipfs failure (invalid image)
  it('should fail if invalid image is provided', async () => {
    const res = await request(server)
      .post('/api/v1/campaigns/uploadImage')
      .attach('file', './tests/media/not-image.txt')

    expect(res.statusCode).toEqual(422)
    expect(res.body.message).toEqual('Only images are allowed!')
  })

  // upload image to ipfs failure (image too large)
  it('should fail if image is too large', async () => {
    const res = await request(server)
      .post('/api/v1/campaigns/uploadImage')
      .attach('file', './tests/media/large-image.png')

    expect(res.statusCode).toEqual(413)
    expect(res.body.message).toEqual('File too large')
  })
})
