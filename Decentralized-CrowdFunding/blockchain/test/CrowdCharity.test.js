/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/** @format */

const { expect } = require('chai')

describe('CrowdCharity', () => {
  let CrowdCharity
  let crowdcharity
  let owner, addr1, addr2
  let campaign

  beforeEach(async () => {
    ;[owner, addr1, addr2, _] = await ethers.getSigners()

    CrowdCharity = await ethers.getContractFactory('CrowdCharity')
    crowdcharity = await CrowdCharity.deploy()

    const REWARD_CONTRACT_ADDRESS = await crowdcharity.rewardContract()
    const charityRewards = await ethers.getContractAt(
      'CharityRewards',
      REWARD_CONTRACT_ADDRESS
    )
    // console.log(await crowdcharity.rewardContract());
    // console.log(charityRewards.address);
    campaign = await crowdcharity.createCampaign(
      ethers.utils.parseEther('200'),
      ethers.utils.parseEther('150'),
      1,
      'Wild Ponies New Record: Dreamers',
      'https://ksr-ugc.imgix.net/assets/041/270/904/a404da8fea68526db91d119577af066c_original.jpg?ixlib=rb-4.0.2&crop=faces&w=1024&h=576&fit=crop&v=1686599531&auto=format&frame=1&q=92&s=45c08bfcd6b527323618cd66bc827a96'
    )
  })

  describe('initiating a campaign', async () => {
    it('should set the right owner', async () => {
      const [_owner, ,] = await crowdcharity.campaigns(0)
      expect(_owner).to.equal(owner.address)
    })
    it('should set the right target', async () => {
      const [, _target] = await crowdcharity.campaigns(0)
      expect(_target).to.equal(ethers.utils.parseEther('200'))
    })
    it('should set the right raised Amount', async () => {
      const [, , _raisedAmount] = await crowdcharity.campaigns(0)
      expect(_raisedAmount).to.equal(ethers.utils.parseEther('0'))
    })
    it('should set the right isopen', async () => {
      const campaign = await crowdcharity.campaigns(0)
      expect(campaign.isOpen).to.equal(true)
    })

    it('should increase the campaign count when created', async () => {
      expect(await crowdcharity.campaignsCount()).to.equal(1)
    })

    it('should emit campaign count and target and owner', async () => {
      expect(campaign).to.emit(CrowdCharity, 'Started')
      // .withArgs(200)
    })
  })

  describe('funding & withdrawing', async () => {
    // it('should not fund if closed', async () => {
    //   await crowdcharity.connect(owner).closeCampaign(1)
    //   await expect(crowdcharity.fundCampaign(1)).to.be.revertedWith(
    //     'Sadly the campaign is closed by the its owner'
    //   )
    // })
    it('should emit Funded when we fund a campaign', async () => {
      expect(
        await crowdcharity.connect(addr1).fundInEth(0, { value: 1 })
      ).to.emit(CrowdCharity, 'Funded')
      // .withArgs(1, 10, addr1.address, owner.address)
    })
    it('should emit Withdrawn when we withdraw', async () => {
      await crowdcharity
        .connect(addr1)
        .fundInEth(0, { value: ethers.utils.parseEther('1') })
      expect(await crowdcharity.withdrawFunds(0)).to.emit(
        CrowdCharity,
        'Withdrawn'
      )
    })
    it('should emit Refunded when we refund', async () => {
      await crowdcharity.connect(addr1).fundInEth(0, { value: 1e5 })
      expect(await crowdcharity.connect(addr1).refund(0)).to.emit(
        CrowdCharity,
        'Refuded'
      )
    })
    // it('should fund the amount being given', async () => {
    //   await crowdcharity.connect(addr1).fundCampaign(1, { value: 10 })
    //   expect(await crowdcharity.funderAmount(1, addr1.address)).to.equal(10)
    // })
  })

  describe('closing a campaign', () => {
    // it('should let only the owner to close the campaign', async () => {
    //   await expect(
    //     crowdcharity.connect(addr1).closeCampaign(1)
    //   ).to.be.revertedWith('Only owner can close his/her campaign')
    // })
    // it('should let the campaign be closed once', async () => {
    //   await crowdcharity.closeCampaign(1)
    //   await expect(
    //     crowdcharity.connect(owner).closeCampaign(1)
    //   ).to.be.revertedWith('campaign is already closed')
    // })
    it('should emit when calling close campaign', async () => {
      expect(await crowdcharity.closeCampaign(0))
        .to.emit(CrowdCharity, 'Closed')
        .withArgs(1)
    })
  })
})

describe('CharityRewards', () => {
  let rewardsContract
  let owner, addr1, addr2
  let token
  beforeEach(async () => {
    ;[owner, addr1, addr2, _] = await ethers.getSigners()

    rewardsContract = await ethers.getContractFactory('CharityRewards')
    rewardsContract = await rewardsContract.deploy(owner.address)
    token = await rewardsContract.addToken(
      'Funding Points',
      'FP',
      'https://bafybeie2pa7gtnjetomxbywp4o4zeasrhk3dj653b324ddzufsculkwa7i.ipfs.w3s.link/Funding-Points.png'
    )
  })

  describe('adding reward token', () => {
    it('should success to add reward token', async () => {
      expect(await rewardsContract.tokensCount()).to.equal(3)
    })
  })
  describe('mint token', () => {
    it('should success to mint token', async () => {
      await rewardsContract.mint(addr1.address, 1, 100)
      expect(await rewardsContract.balanceOf(addr1.address, 1)).to.equal(100)
    })
  })
})
