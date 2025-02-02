const assert = require('assert')
const ganache = require('ganache-cli')
const options = { gasLimit: 100000000 };
const Web3 = require('web3')
const web3 = new Web3(ganache.provider(options))

const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let managerAccount
let accounts
let factory
let campaignAddress
let campaign

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  managerAccount = accounts[1]

  factory = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({ data: compiledCampaignFactory.evm.bytecode.object })
    .send({ from: managerAccount, gas: '10000000' })

  await factory.methods.createCampaign('100').send({
    from: managerAccount,
    gas: '10000000'
  })

  const campaignAddresses = await factory.methods.getDeployedCampaigns().call()
  campaignAddress = campaignAddresses[0]
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress)
})

describe('Campaigns', () => {
  it('deploys a factory and a compaign', () => {
    assert.ok(factory.options.address)
    assert.ok(campaign.options.address)
  })

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call()
    assert.equal(managerAccount, manager)
  })

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[2]
    })

    const isContributor = await campaign.methods.approvers(accounts[2]).call()
    assert(isContributor)
  })

  it('requires a minimum contribution', async () => {
    let executed
    try {
      await campaign.methods.contribute().send({
        value: '100',
        from: accounts[2]
      })
      executed = 'success'
    } catch (err) {
      executed = 'fail'
    }

    assert.equal('fail', executed)
  })

  it('allows a manager to make a payment request', async () => {
    await campaign.methods
      .createRequest('Buy betteries', '100', accounts[2])
      .send({
        from: managerAccount,
        gas: '1000000'
      })

    const request = await campaign.methods.requests(0).call()
    assert.equal('Buy betteries', request.description)
    assert.equal('100', request.value)
    assert.equal(accounts[2], request.recipient)
  })

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      value: web3.utils.toWei('10', 'ether'),
      from: accounts[0]
    })

    await campaign.methods
      .createRequest('Buy betteries', web3.utils.toWei('5', 'ether'), accounts[2])
      .send({
        from: managerAccount,
        gas: '1000000'
      })

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    })

    await campaign.methods.finalizeRequest(0).send({
      from: managerAccount,
      gas: '1000000'
    })

    let balance = await web3.eth.getBalance(accounts[2])
    balance = web3.utils.fromWei(balance, 'ether')
    balance = parseFloat(balance)
    assert(balance > 104)
  })
})