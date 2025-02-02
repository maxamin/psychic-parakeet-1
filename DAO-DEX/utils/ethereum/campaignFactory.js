import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

// Address (tell web3 that a deployed copy of "CampaignFactory" exists)
//// With this address i can interact with the CampaignFactory contract directly from Remix and also deploy new Campaigns. To do this, connect to remix > Run, Injected web3 provider, paste address at "at address" to see the already deployed contract and the campaigns
const CONTRACT_ADDRESS = '0xF44177A880383176e20deB7003e64ACCDe4CB8A1'

const instance = new web3.eth.Contract(CampaignFactory.abi, CONTRACT_ADDRESS)

export default instance
