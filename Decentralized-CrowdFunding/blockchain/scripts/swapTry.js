/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { encodePath } = require('../utils.js')

async function main() {
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
  const WETH9 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

  let accounts

  const weth = await ethers.getContractAt('IWETH', WETH9)
  const dai = await ethers.getContractAt('IERC20', DAI)
  const usdc = await ethers.getContractAt('IERC20', USDC)

  accounts = await ethers.getSigners(1)

  ////////////////////////////////////////////////////////////////
  //  ________                                    __            //
  // /        |                                  /  |           //
  // $$$$$$$$/   ______   _____  ____    ______  $$ |  ______   //
  // $$ |__     /      \ /     \/    \  /      \ $$ | /      \  //
  // $$    |    $$$$$$  |$$$$$$ $$$$  |/$$$$$$  |$$ |/$$$$$$  | //
  // $$$$$/     /    $$ |$$ | $$ | $$ |$$ |  $$ |$$ |$$    $$ | //
  // $$ |_____ /$$$$$$$ |$$ | $$ | $$ |$$ |__$$ |$$ |$$$$$$$$/  //
  // $$       |$$    $$ |$$ | $$ | $$ |$$    $$/ $$ |$$       | //
  // $$$$$$$$/  $$$$$$$/ $$/  $$/  $$/ $$$$$$$/  $$/  $$$$$$$/  //
  //                                   $$ |                     //
  //                                   $$ |                     //
  //                                   $$/                      //
  //                                                            //
  ////////////////////////////////////////////////////////////////

  // const SwapExamples = await ethers.getContractFactory("SwapExamples")
  // swapExamples = await SwapExamples.deploy()
  // await swapExamples.deployed()

  // Deposit WETH
  // await weth.connect(accounts[0]).deposit({ value: 10 })
  // await weth.connect(accounts[0]).withdraw(10)
  // await weth.approve(swapExamples.address, amountIn)

  // Swap single
  // await swapExamples.connect(accounts[0]).swapExactInputSingle(
  //   accounts[1].address,
  //   {value:  10n ** 18n}
  // )

  // console.log("DAI balance", await dai.balanceOf(accounts[1].address))

  // console.log("testy", await swapExamples.connect(accounts[1]).testy3())
  // console.log(await accounts[0].getBalance())

  // Swap multiple
  // const path = [USDC, DAI]
  // const fees = [500]
  // const encodedPath = encodePath(path, fees)
  // // console.log(encodedPath)
  // inputToken = await ethers.getContractAt("IERC20", path[0])
  // inputAmount = 10n ** 3n

  // await inputToken.connect(accounts[1]).approve(swapExamples.address, inputAmount)
  // await swapExamples.connect(accounts[1]).swapExactInputMultihop(
  //   inputAmount,
  //   accounts[0].address,
  //   encodedPath,
  //   path[0]
  // )
  // console.log("dai balance", await dai.balanceOf(accounts[0].address))
  // console.log("test", await swapExamples.connect(accounts[1]).testy3())

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //                                                    __   ______   __                            __    __                //
  //                                                   /  | /      \ /  |                          /  |  /  |               //
  //   _______   ______    ______   __   __   __   ____$$ |/$$$$$$  |$$ |____    ______    ______  $$/  _$$ |_    __    __  //
  //  /       | /      \  /      \ /  | /  | /  | /    $$ |$$ |  $$/ $$      \  /      \  /      \ /  |/ $$   |  /  |  /  | //
  // /$$$$$$$/ /$$$$$$  |/$$$$$$  |$$ | $$ | $$ |/$$$$$$$ |$$ |      $$$$$$$  | $$$$$$  |/$$$$$$  |$$ |$$$$$$/   $$ |  $$ | //
  // $$ |      $$ |  $$/ $$ |  $$ |$$ | $$ | $$ |$$ |  $$ |$$ |   __ $$ |  $$ | /    $$ |$$ |  $$/ $$ |  $$ | __ $$ |  $$ | //
  // $$ \_____ $$ |      $$ \__$$ |$$ \_$$ \_$$ |$$ \__$$ |$$ \__/  |$$ |  $$ |/$$$$$$$ |$$ |      $$ |  $$ |/  |$$ \__$$ | //
  // $$       |$$ |      $$    $$/ $$   $$   $$/ $$    $$ |$$    $$/ $$ |  $$ |$$    $$ |$$ |      $$ |  $$  $$/ $$    $$ | //
  //  $$$$$$$/ $$/        $$$$$$/   $$$$$/$$$$/   $$$$$$$/  $$$$$$/  $$/   $$/  $$$$$$$/ $$/       $$/    $$$$/   $$$$$$$ | //
  //                                                                                                             /  \__$$ | //
  //                                                                                                             $$    $$/  //
  //                                                                                                              $$$$$$/   //
  //                                                                                                                        //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const CrowdCharity = await ethers.getContractFactory('CrowdCharity')
  const crowdCharity = await CrowdCharity.deploy()
  await crowdCharity.connect(accounts[0]).createCampaign(100)

  ///////////////////////
  //                   //
  //    Swap Single    //
  //                   //
  ///////////////////////
  await crowdCharity
    .connect(accounts[1])
    .fundCampaignWithEth(1, { value: 10n ** 18n })

  /////////////////////////
  //                     //
  //    Swap multiple    //
  //                     //
  /////////////////////////
  const path = [USDC, DAI]
  const fees = [500]
  const encodedPath = encodePath(path, fees)
  // console.log(encodedPath)
  inputToken = await ethers.getContractAt('IERC20', path[0])
  inputAmount = 1000

  /////////////////////////
  //                     //
  //    USDC to DAI      //
  //                     //
  /////////////////////////
  // generate USDC coins for address1 just for testing
  await crowdCharity
    .connect(accounts[0])
    .single_Swap_For_Testing(accounts[1].address, USDC, { value: 10n ** 18n }) // USDC
  // console.log("USDC:", await usdc.balanceOf(accounts[1].address))
  // approve contract to use this USDC amount
  await inputToken
    .connect(accounts[1])
    .approve(crowdCharity.address, inputAmount)
  // fund with USDC
  await crowdCharity
    .connect(accounts[1])
    .fundCampaignWithToken(1, inputAmount, encodedPath, path[0])

  ////////////////////////
  //                    //
  //    DAI directly    //
  //                    //
  ////////////////////////

  // generate DAI coins for address1 just for testing
  await crowdCharity
    .connect(accounts[0])
    .single_Swap_For_Testing(accounts[1].address, DAI, { value: 10n ** 18n }) // DAI
  // console.log("DAI:", await dai.balanceOf(accounts[1].address))
  // approve contract to use this DAI amount
  await dai.connect(accounts[1]).approve(crowdCharity.address, inputAmount)
  //  fund with DAI
  await crowdCharity
    .connect(accounts[1])
    .fundCampaignWithToken(1, inputAmount, [], path[1])

  // funderAmount should increase in DAI
  console.log('DAI:', await crowdCharity.funderAmount(1, accounts[1].address))
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
