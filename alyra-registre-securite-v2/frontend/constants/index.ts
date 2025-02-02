export const contractAddress = `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}` as `0x${string}`
export const genesisBlock = `${process.env.NEXT_PUBLIC_GENESIS_BLOCK}`
export const network = `${process.env.NEXT_PUBLIC_NETWORK}`
export const httpTransport = `${process.env.NEXT_PUBLIC_HTTP_TRANSPORT}`
export const PINATA_API_KEY = `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`
export const PINATA_SECRET_API_KEY = `${process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY}`
export const IPFS_BASE_URL: string = "https://ipfs.io/ipfs/"
export const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_fromTokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_toTokenId",
                "type": "uint256"
            }
        ],
        "name": "BatchMetadataUpdate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_company",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_firstName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_action",
                "type": "string"
            }
        ],
        "name": "CompanyAccountUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "MetadataUpdate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_addr",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_addressName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_siret",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_siteName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_siteAddressName",
                "type": "string"
            }
        ],
        "name": "RegisterCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_company",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_verifier",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_registerId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_securityType",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_taskId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum SecurityRegister.VerificationStatus",
                "name": "_taskStatus",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_siteName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_timestamp",
                "type": "uint256"
            }
        ],
        "name": "VerificationTaskCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_company",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_taskId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum SecurityRegister.VerificationStatus",
                "name": "_taskStatus",
                "type": "uint8"
            }
        ],
        "name": "VerificationTaskUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_verifier",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_taskId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum SecurityRegister.VerificationStatus",
                "name": "_taskStatus",
                "type": "uint8"
            }
        ],
        "name": "VerificationTaskValidated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_verifier",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_firstName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_action",
                "type": "string"
            }
        ],
        "name": "VerifierAccountUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_company",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_verifier",
                "type": "address"
            }
        ],
        "name": "VerifierAddedToCompany",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_verifier",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_addressName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_siret",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_approvalNumber",
                "type": "string"
            }
        ],
        "name": "VerifierCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_verifier",
                "type": "address"
            }
        ],
        "name": "addVerifierToCompany",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_addressName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_siret",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_siteName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_siteAddressName",
                "type": "string"
            }
        ],
        "name": "createRegister",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_siteName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_securityType",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_registerId",
                "type": "uint256"
            }
        ],
        "name": "createVerificationTask",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_addressName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_siret",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_approvalNumber",
                "type": "string"
            }
        ],
        "name": "createVerifier",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCompanyAccount",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_taskId",
                "type": "uint256"
            }
        ],
        "name": "getVerificationTaskStatus",
        "outputs": [
            {
                "internalType": "enum SecurityRegister.VerificationStatus",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_company",
                "type": "address"
            }
        ],
        "name": "isCompany",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_account",
                "type": "address"
            }
        ],
        "name": "isCompanyAccount",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_verifier",
                "type": "address"
            }
        ],
        "name": "isVerifier",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_account",
                "type": "address"
            }
        ],
        "name": "isVerifierAccount",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_tokenURI",
                "type": "string"
            }
        ],
        "name": "safeMint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_account",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_firstName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_action",
                "type": "string"
            }
        ],
        "name": "updateCompanyAccount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_taskId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_action",
                "type": "string"
            }
        ],
        "name": "updateVerificationTask",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_account",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_firstName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_action",
                "type": "string"
            }
        ],
        "name": "updateVerifierAccount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_taskId",
                "type": "uint256"
            }
        ],
        "name": "validateVerificationTask",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]




