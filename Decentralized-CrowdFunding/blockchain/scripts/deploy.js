/* eslint-disable no-undef */
/** @format */

async function main() {
  // const [add1, add2, add3, add4, add5, add6, add7] = await ethers.getSigners()
  // console.log(`Deploying contracts with the account: ${add1.address}`)
  // const balance = await add1.getBalance();
  // console.log(`Account balance: ${balance.toString()}`);

  const CrowdCharity = await ethers.getContractFactory('CrowdCharity')
  const crowdcharity = await CrowdCharity.deploy()

  const REWARD_CONTRACT_ADDRESS = await crowdcharity.rewardContract()
  const charityrewards = await ethers.getContractAt(
    'CharityRewards',
    REWARD_CONTRACT_ADDRESS
  )

  console.log(`CrowdCharity address: ${crowdcharity.address}`)
  console.log(`CharityRewards address: ${charityrewards.address}`)

  await Promise.all([
    crowdcharity
      // .connect(add1)
      .createCampaign(
        ethers.utils.parseEther('1000'),
        ethers.utils.parseEther('400'),
        1,
        'Wild Ponies New Record: Dreamers',
        'https://ksr-ugc.imgix.net/assets/041/270/904/a404da8fea68526db91d119577af066c_original.jpg?ixlib=rb-4.0.2&crop=faces&w=1024&h=576&fit=crop&v=1686599531&auto=format&frame=1&q=92&s=45c08bfcd6b527323618cd66bc827a96'
      )
    // crowdcharity
    //   .connect(add2)
    //   .createCampaign(
    //     ethers.utils.parseEther('1000'),
    //     ethers.utils.parseEther('400'),
    //     1,
    //     'Handbook for Budding Little Gardeners',
    //     'https://ksr-ugc.imgix.net/assets/041/243/686/da9ad8dbd39e190d942cfeca65a00105_original.jpg?ixlib=rb-4.0.2&crop=faces&w=1024&h=576&fit=crop&v=1686326958&auto=format&frame=1&q=92&s=c6866780471af472a8dd4536c1bb7851'
    //   ),
    // crowdcharity
    //   .connect(add3)
    //   .createCampaign(
    //     ethers.utils.parseEther('7000'),
    //     ethers.utils.parseEther('4000'),
    //     1,
    //     'The Shunned House: Recluse Replica',
    //     'https://ksr-ugc.imgix.net/assets/041/462/946/bba02ae0a2fa240c14feb087229ce62f_original.png?ixlib=rb-4.0.2&crop=faces&w=1024&h=576&fit=crop&v=1688093664&auto=format&frame=1&q=92&s=997427775d9f695fe4975afed85434a2'
    //   ),
    // crowdcharity
    //   .connect(add4)
    //   .createCampaign(
    //     ethers.utils.parseEther('5000'),
    //     ethers.utils.parseEther('2500'),
    //     1,
    //     'The BOOK OF CYCLING',
    //     'https://ksr-ugc.imgix.net/assets/041/394/251/e71ce6b9bf05333b49a9cbd22640d7f7_original.png?ixlib=rb-4.0.2&crop=faces&w=1024&h=576&fit=crop&v=1687530542&auto=format&frame=1&q=92&s=577b748cfcab982158909e2396f841e6'
    //   ),
    // crowdcharity
    //   .connect(add5)
    //   .createCampaign(
    //     ethers.utils.parseEther('40000'),
    //     ethers.utils.parseEther('25000'),
    //     1,
    //     'The Everything Bags - Cameras, Tech, & Travel',
    //     'https://ksr-ugc.imgix.net/assets/041/447/005/6b4cd516e52764c0a62ac1446a5ae6b3_original.png?ixlib=rb-4.0.2&crop=faces&w=1024&h=576&fit=crop&v=1687979380&auto=format&frame=1&q=92&s=a2ea4246a91133bf4cdf236fff384811'
    //   ),
    // crowdcharity
    //   .connect(add6)
    //   .createCampaign(
    //     ethers.utils.parseEther('10000'),
    //     ethers.utils.parseEther('6000'),
    //     1,
    //     'Shaper Trace: Go from Sketch to Vector in Seconds',
    //     'https://ksr-ugc.imgix.net/assets/041/374/781/43bceb1f5620b6a6e6bbf44611796bbf_original.jpg?ixlib=rb-4.0.2&crop=faces&w=1024&h=576&fit=crop&v=1687372769&auto=format&frame=1&q=92&s=8946d180af6042ac302d7fe876c1b5a5'
    //   ),
    // crowdcharity
    //   .connect(add7)
    //   .createCampaign(
    //     ethers.utils.parseEther('13000'),
    //     ethers.utils.parseEther('7000'),
    //     1,
    //     'Makers Cabinet: Set Squares',
    //     'https://ksr-ugc.imgix.net/assets/041/355/811/89d37cbd75ee5aa84d3b2bfef507678b_original.png?ixlib=rb-4.0.2&crop=faces&w=1024&h=576&fit=crop&v=1687251005&auto=format&frame=1&q=92&s=5483f83dc33a9d0f85e782d16765f970'
    //   )
  ])
  // console.log(await crowdcharity.getCampaignsByIds([0, 1]))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
