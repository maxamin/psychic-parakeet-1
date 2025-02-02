import { profile, cards, announce } from './assets'

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: cards,
    link: '/',
    pageUrl: 'http://localhost:5173/'
  },
  {
    name: 'Create Campaign',
    imgUrl: announce,
    link: '/create-campaign',
    pageUrl: 'http://localhost:5173/create-campaign'
  },
  {
    name: 'Profile',
    imgUrl: profile,
    link: '/profile',
    pageUrl: 'http://localhost:5173/profile'
  }
]

export const CAMPAIGN_CONTRACT_ADDRESS =
  '0xeb06D7AbA4Ae11B9a078AFE08cBeBE2d5DC5da02'

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
