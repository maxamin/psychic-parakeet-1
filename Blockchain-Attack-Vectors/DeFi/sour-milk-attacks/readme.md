# Attacking PoS Systems: Sour Milk Attack

## Description

A Sour milk attack is a specific type of attack on a blockchain network that targets the consensus mechanism by exploiting the trust and verification processes among nodes, particularly the validators or nodes responsible for confirming the validity of blocks and maintaining the blockchain's integrity.

In a blockchain network, validators (also known as nodes) play a crucial role in achieving consensus on the state of the blockchain. They are responsible for validating and adding new blocks to the chain, ensuring that only valid transactions are included. The consensus mechanism used (e.g., Proof of Stake) ensures that the majority of validators agree on the validity of new blocks before they are added to the blockchain.

### How It Usually Happens?

In a Sour milk attack, certain validators, referred to as "base validators," act maliciously to undermine the consensus process. 

- These base validators engage in a coordinated effort to create confusion among other validators, especially the honest ones, by publishing both genuine and fraudulent blocks concurrently.
- This creates a situation where honest validators are unsure which blocks are valid and which ones are not.
- To further complicate matters, the base validators collaborate with other malicious nodes in the network to carry out the same strategy.
- By working together, they can amplify the impact of the attack and make it even more challenging for honest validators to distinguish between valid and invalid blocks.

### Impact:

The ultimate goal of the Sour milk attack is to disrupt the consensus mechanism, effectively freezing the network and potentially causing it to fork into different branches. This can lead to a breakdown of the blockchain's trustworthiness and integrity, as the confusion among validators may prevent them from reaching a reliable agreement on the valid state of the blockchain.

What makes this type of attack concerning is that it can be executed with relatively low resources. Only a small fraction of the network's validators, the "base validators," are required to coordinate and initiate the attack, but their impact can be significant enough to disrupt the entire network's consensus process.
