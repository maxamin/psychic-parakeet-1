# Slippage Attacks on Decentralized Exchanges (DEXs)

## Overview:

Slippage attacks are a concept related to decentralized exchanges (DEXs) in the context of blockchain and cryptocurrency trading. DEXs are platforms that facilitate peer-to-peer trading of cryptocurrencies without the need for a central intermediary. **Slippage refers to the difference between the expected price of a trade and the actual executed price due to market volatility or liquidity issues.**

In the context of DEXs, slippage can occur because of the decentralized nature of these platforms. Since DEXs rely on automated market-making algorithms and liquidity pools to match and execute trades, the available liquidity for a particular token pair can change rapidly, especially during periods of high volatility or low liquidity. This means that the price at which a trader expects to execute a trade may not be the same as the price at which the trade is executed.

Slippage can be particularly problematic for larger trades, where the size of the trade order can significantly impact the available liquidity in the market. Traders may end up receiving fewer tokens than expected when buying or selling, or they may pay a higher price than expected when buying.

### How Slippage Attacks Work:

Slippage attacks occur when malicious actors exploit this slippage phenomenon to their advantage. Here's how a slippage attack could work:

Let's assume we're looking at a DEX for a token pair: ETH/ABC, where ABC is a low liquidity token.

**Initial State**: 1 ETH is priced at 100 ABC tokens in the DEX.

**Monitoring Phase:** An attacker notices that the liquidity for ABC is low, making it susceptible to price manipulation.

**Attack Execution:** The attacker places a large buy order for 10 ETH, willing to buy at a price up to 110 ABC per ETH. Due to the size of this order and low liquidity, the price rapidly climbs to 110 ABC for 1 ETH.

- This sudden price movement causes other traders' orders to trigger, buying ABC at this inflated rate.
- Before the attacker's entire order is filled, they cancel the remaining portion of their order.
- The attacker then places a new sell order for ETH at the inflated price, selling for more ABC than they initially spent.

**Profit Calculation:**

- Suppose the attacker successfully purchased 5 ETH at an average price of 105 ABC per ETH, spending 525 ABC tokens.
- The attacker then sells the 5 ETH at 110 ABC per ETH, receiving 550 ABC tokens.
- The net profit from this attack: 550 ABC (received) - 525 ABC (spent) = 25 ABC.

In this attack, the attacker takes advantage of the market's inherent susceptibility to slippage, manipulating the price to their advantage and making a profit. Such attacks can have a negative impact on the overall trust and usability of decentralized exchanges if they become a common occurrence.

### Key Vulnerabilities:

1. ********Key Parameter:******** DeFi platforms must allow users to specify a slippage parameter: the minimum amount of tokens they want to be returned from a swap. Auditors should always be on the lookout for swaps which set slippage to 0.
2. ****No Expiration Deadline:**** Advanced protocols like Automated Market Makers (AMMs) can allow users to specify a deadline parameter that enforces a time limit by which the transaction must be executed. Without a deadline parameter, the transaction may sit in the mempool and be executed at a much later time, potentially resulting in a worse price for the user.
3. ****Incorrect Slippage Calculation:**** The slippage parameter should be something like "minTokensOut" - the minimum amount of tokens the user will accept for the swap. Anything else is a red flag to watch out for as it will likely constitute an incorrect slippage parameter.
4. ****Mismatched Slippage Precision:**** Some platforms allow a user to redeem or withdraw from a set of output tokens with a wide range of different precision values. These platforms must ensure that the slippage parameter "minTokensOut" is scaled to match the precision of the selected output token, else the slippage parameter may be ineffective and lead to precision loss errors.

## Remediation:

Here are some strategies that DEX platforms and the blockchain community can consider:

1. **Improved Liquidity Management**: DEXs can work on optimizing their liquidity management algorithms to better handle large trade orders without causing significant price movements. This could involve implementing mechanisms to split large orders into smaller chunks or encouraging liquidity providers to deposit more funds into the liquidity pools.
2. **Dynamic Fee Structure**: DEXs can implement a dynamic fee structure that adjusts trading fees based on the size of the order. This discourages attackers from placing large orders that could cause slippage since they would incur higher fees.
3. **Anti-Front Running Measures**: Front running is a related concept where a malicious actor anticipates a large trade and places their own trade ahead to profit from the subsequent price movement. DEXs can implement measures to prevent or mitigate front-running, which could indirectly address slippage attacks as well.
4. **Order Execution Delays**: A slight delay in executing trades after they are placed could help mitigate slippage attacks. This delay would allow the market to adjust to changes in liquidity and reduce the effectiveness of quick, large orders in causing price movements.
5. **Price Oracles and Decentralized Data Feeds**: Using reliable price oracles and decentralized data feeds can help ensure that the price used for executing trades is accurate and not easily manipulated.
6. **Layer 2 Scaling Solutions**: Implementing layer 2 scaling solutions, such as sidechains or state channels, can help improve the speed and efficiency of DEX transactions, reducing the likelihood of slippage during high network congestion.
7. **Automated Monitoring and Intervention**: DEXs can implement automated monitoring systems that detect unusual trading patterns or sudden price movements and trigger interventions to stabilize the market or halt trading temporarily.
8. **Community Governance**: DEX platforms can involve their user community in decision-making processes, including proposing and voting on changes to the platform's trading rules or fee structures, which can help address potential vulnerabilities.

## Case Study: The Jimbo’s Protocol

On May 28, 2023, Jimbo’s Protocol on the Arbitrum chain was hacked. The hackers were able to exploit a vulnerability in the protocol’s slippage control mechanism, which allowed them to steal around $7.5 million worth of ETH.

### The Attack:

The root cause of the exploit was a vulnerability in the protocol’s slippage control mechanism. Slippage control is a mechanism that prevents large trades from causing significant price fluctuations. In the case of the Jimbo protocol, the lack of slippage control in the shift() function of the JimboController contract allowed the hacker to exploit the vulnerability.

![image](https://github.com/shubhisaran/Blockchain-Attack-Vectors/assets/113500663/e3ea3acc-bc15-4d7d-ad63-59ff2301a8e3)

- The attacker borrowed around 10,000 ETH from AAVE, a decentralized lending protocol.
- They then added some JIMBO tokens at much higher prices than the current market price. These bins are essentially ticks that indicate the price at which the token is traded.
- The attacker exchanged the borrowed ETH for a significant amount of Jimbo tokens, using the [ETH-JIMBO] trading pair. This caused the price of JIMBO to spike up to a very high bin.
- The attacker transferred 100 JIMBO tokens to the JimboController contract.
- Then, the exploiter manipulated the token balance in the liquidity pool by calling the shift function of the JimboController contract.
- Following the price increase, when the rebalance was triggered, 10% of ETH was moved to bins below the active price, which was very high. The attacker then sold JIMBO tokens to deplete the anchor bins and bring the price back down.
- A rebalance was triggered, moving 10% of ETH into bins below the current, much lower, active price.
- This process is repeated multiple times, allowing JIMBO to be bought at a lower price each time.
- The attacker then swapped the acquired Jimbo tokens for ETH. After repaying the flash loan, the attacker made a profit of approximately 7.5 million.

### The Aftermath:

Immediately after the exploit, The attacker bridged the funds from Arbitrum Chain to the Ethereum chain.

![image](https://github.com/shubhisaran/Blockchain-Attack-Vectors/assets/113500663/458e497f-1839-44ba-a20d-4e4a4364d739)


The Project sent an [on-chain](https://etherscan.io/tx/0xa77e60f93a350588211275c20d6e05b3b134b3e0de9d15f9cbd77c9e8782912b) message to the Hacker, requesting the return of 90% of the funds in exchange for stopping all investigation. The price of the token dropped by 40% immediately following the attack.
