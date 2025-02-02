# Sombrero Protocol

A dynamic bug bounty protocol that completely reshapes how web3 security is built.

The Sombrero Protocol is an open-source, decentralized, and automatic bounty marketplace for the Cosmos ecosystem, allowing hackers to search for subscribed contracts that could be exploited in exchange for a reward.

The concept behind this protocol is that it creates a win-win scenario for all parties involved:

    1. Hackers earn a reward for their efforts while remaining anonymous.
    2. Subscribed contracts recover most of their funds and can quickly update the bug, keeping smart contracts in the ecosystem more secure.

To participate in the bounty marketplace, contracts must subscribe to the protocol and set their bounty conditions upfront. These conditions include:

    1. The address of the smart contract to be protected.
    2. The percentage of the total hacked amount that hackers will keep as a reward.
    3. The minimum amount for small hack attempts.

All bounty conditions are recorded on-chain in the smart contract, eliminating the need for negotiations or personal information sharing.

Once a hacker successfully exploits a protected contract and sends the stolen funds to the Sombrero smart contract, the reward is automatically paid to the hacker, the subscribed contract receives the remaining tokens, and a fee is collected by the protocol, which can be withdrawn later by the contract administrator.

As a proof of their achievement, hackers will receive a freshly minted NFT that records the hack conditions on-chain. This NFT can be kept as a badge of honor to showcase the hacker's skills and contributions to the ecosystem's security.

The NFT metadata will live on-chain and contains the following traits:

    Date of the hack,
    Address of the exploited contract,
    Total amount hacked,
    Bounty collected,
    Hacker address,

## Testnet deployment

    blockchain:         Pisco-1 testnet for Terra 2.0
    deployer:           terra12e98lr4kl86g48y394fxt9ygacnhvtmpwtj4qe

### Sombrero contract

    store_code_hash:    B1CD59C54A16F42B7DD9FF3D552E01145D271FE439BAFBABC9973A365B192C0D
    code_id:            7261
    instantiate_has:    3416C1469E35448463A2DED55F0B6C9F921824DCF792E04270F3BF9A13888617
    contract_addr:      terra12w4hwnd8xlakg2t4l7v2t0490v74q2ev09rd0j9k4022gqs4auys8s8z9y

### Cw721-metadata-onchain contract

    store_code_hash:    AC89F3D0A0B04F915607FD58D8EB3D11352629179B61C0F941C93465CF2A181A
    code_id:            7248
    instantiate_hash:   3416C1469E35448463A2DED55F0B6C9F921824DCF792E04270F3BF9A13888617
    cw721_addr:         terra19jaz3emha88rnq6jtz0lzjal9rluvtkmmusk8wcn07j0kw3dprdsvq0se8

### Cw20-base contract

    store_code_hash:    70AFF93A205F7BE50AABB4CBFC0C1535F726B5167D3B1D001C44FC0DA972CB86
    code_id:            7249
    instantiate_hash:   466497C9B072A8C48BFEDE1ABE4C6557389F0C81D55DF08A63784660CBD047F1
    cw20_addr:          terra1k0wj8tev6s5gh3kts3t7pch9mzruuynqzcgmh75xgkst40e0t7ss4q87w8
