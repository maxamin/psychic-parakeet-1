/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const main = async () => {
  const crowdcharity = await ethers.getContractAt(
    'CrowdCharity',
    '0xeb06D7AbA4Ae11B9a078AFE08cBeBE2d5DC5da02'
  )
  const charityrewards = await ethers.getContractAt(
    'CharityRewards',
    '0x06F249780125f7C81cF53Eb3613858958203b9Dc'
  )

  // const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  // const dai = await ethers.getContractAt('IERC20', DAI)

  const [add1, add2, add3, add4] = await ethers.getSigners()
  // await crowdcharity
  //   .connect(add3)
  //   .fundInEth(0, { value: ethers.utils.parseEther('0.01') }) //16.68
  // await crowdcharity
  //   .connect(add4)
  //   .fundInEth(1, { value: ethers.utils.parseEther('1') })

  // await crowdcharity.connect(add2).withdrawFunds(1)
  // await crowdcharity.connect(add4).refund(1)
  // console.log(await charityrewards.balanceOf(add1.address, 1) / 10 ** 18)
  // console.log(await dai.balanceOf(add3.address) / 1e18)
  // console.log(await crowdcharity.fundersContributions(1, add4.address) / 1e18)
  console.log(await crowdcharity.campaigns(0))

  // console.log(await crowdcharity.campaignsCount())
  // console.log(await crowdcharity.getCampaignsByIds([0]))

  // const filter = crowdcharity.filters.Funded(0, null, null, null, null);
  // const filter = crowdcharity.filters.Funded(null, null, null, add4.address, null);
  // const events = await crowdcharity.queryFilter(filter)
  // const campaignsIds = events.map((event) => (Number(event.args.campaignId)))
  // const campaigns = await crowdcharity.getCampaignsByIds(campaignsIds)
  // console.log(campaigns)

  // console.log(await charityrewards.tokensCount());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
