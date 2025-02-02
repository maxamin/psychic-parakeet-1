/* eslint-disable no-undef */
import dotenv from 'dotenv'
dotenv.config()

export const MONGO_PRODUCTION_URI = process.env.MONGO_PRODUCTION_URI
export const MONGO_DEVELOPMENT_URI = process.env.MONGO_DEVELOPMENT_URI
export const PORT = process.env.PORT
export const NODE_ENV = process.env.NODE_ENV
export const JSON_RPC_ETHEREUM_PROVIDER = process.env.JSON_RPC_ETHEREUM_PROVIDER
export const WEB3_STORAGE_TOKEN = process.env.WEB3_STORAGE_TOKEN
export const CAMPAIGN_CONTRACT_ADDRESS =
  '0xeb06D7AbA4Ae11B9a078AFE08cBeBE2d5DC5da02'
export const REWARD_CONTRACT_ADDRESS =
  '0x06F249780125f7C81cF53Eb3613858958203b9Dc'

export const CAMPAIGN_CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'campaignId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'campaignOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      }
    ],
    name: 'Closed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'campaignId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fundedAmount',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'funder',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'campaignOwner',
        type: 'address'
      }
    ],
    name: 'Funded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'campaignId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'campaignOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Refunded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'campaignOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'campaignId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'rewardTokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'campaignTimestamp',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'campaignTarget',
        type: 'uint256'
      }
    ],
    name: 'Started',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'campaignId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'campaignOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'Withdrawn',
    type: 'event'
  },
  {
    stateMutability: 'payable',
    type: 'fallback'
  },
  {
    inputs: [],
    name: 'DAI',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'SWAPROUTER',
    outputs: [
      {
        internalType: 'contract ISwapRouter',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'WETH9',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'campaigns',
    outputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'target',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'raisedAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'withdrawnAmount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'timeStamp',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rewardTokenId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'softcap',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'isOpen',
        type: 'bool'
      },
      {
        internalType: 'string',
        name: 'image',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'title',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'campaignsCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_campaignId',
        type: 'uint256'
      }
    ],
    name: 'closeCampaign',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_target',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_softcap',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_rewardTokenId',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: '_title',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_image',
        type: 'string'
      }
    ],
    name: 'createCampaign',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'dummy',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_campaignId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_inputAmount',
        type: 'uint256'
      }
    ],
    name: 'fundInDAI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_campaignId',
        type: 'uint256'
      }
    ],
    name: 'fundInEth',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_campaignId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_inputAmount',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: '_path',
        type: 'bytes'
      },
      {
        internalType: 'address',
        name: '_inputToken',
        type: 'address'
      }
    ],
    name: 'fundInToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'fundersContributions',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getAllCampaigns',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'target',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'raisedAmount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawnAmount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'timeStamp',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'rewardTokenId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'softcap',
            type: 'uint256'
          },
          {
            internalType: 'bool',
            name: 'isOpen',
            type: 'bool'
          },
          {
            internalType: 'string',
            name: 'image',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'title',
            type: 'string'
          }
        ],
        internalType: 'struct CrowdCharity.Campaign[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_campaignId',
        type: 'uint256'
      }
    ],
    name: 'getCampaign',
    outputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'target',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'raisedAmount',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'isOpen',
        type: 'bool'
      },
      {
        internalType: 'string',
        name: 'image',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'title',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: 'campaignIds',
        type: 'uint256[]'
      }
    ],
    name: 'getCampaignsByIds',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'target',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'raisedAmount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawnAmount',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'timeStamp',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'rewardTokenId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'softcap',
            type: 'uint256'
          },
          {
            internalType: 'bool',
            name: 'isOpen',
            type: 'bool'
          },
          {
            internalType: 'string',
            name: 'image',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'title',
            type: 'string'
          }
        ],
        internalType: 'struct CrowdCharity.Campaign[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_campaignId',
        type: 'uint256'
      }
    ],
    name: 'refund',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'rewardContract',
    outputs: [
      {
        internalType: 'contract CharityRewards',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_campaignId',
        type: 'uint256'
      }
    ],
    name: 'withdrawFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    stateMutability: 'payable',
    type: 'receive'
  }
]

export const REWARD_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_deployer',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'tokenName',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'tokenSymbol',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'tokenUri',
        type: 'string'
      }
    ],
    name: 'Added',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool'
      }
    ],
    name: 'ApprovalForAll',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]'
      }
    ],
    name: 'TransferBatch',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'TransferSingle',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'value',
        type: 'string'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      }
    ],
    name: 'URI',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_tokenName',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_tokenSymbol',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_tokenUri',
        type: 'string'
      }
    ],
    name: 'addToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'accounts',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]'
      }
    ],
    name: 'balanceOfBatch',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_from',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256'
      }
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_from',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: '_tokensIds',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: '_tokensAmounts',
        type: 'uint256[]'
      }
    ],
    name: 'burnBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'deployer',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTokens',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'uri',
            type: 'string'
          }
        ],
        internalType: 'struct CharityRewards.Token[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokensHolder',
        type: 'address'
      }
    ],
    name: 'getTokensBalances',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address'
      }
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256'
      }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_to',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: '_tokensIds',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: '_tokensAmounts',
        type: 'uint256[]'
      }
    ],
    name: 'mintBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool'
      }
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'tokens',
    outputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'symbol',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'uri',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'tokensCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'uri',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]
