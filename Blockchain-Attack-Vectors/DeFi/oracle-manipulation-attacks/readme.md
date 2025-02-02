# Oracle Manipulation Attack on Blockchain

## ****Description:****

Oracle attacks in blockchain refer to a type of vulnerability where an attacker exploits the reliance of smart contracts on external data sources, known as oracles, to manipulate the execution of the contract or obtain unauthorized information. 

Oracles are mechanisms that allow smart contracts to interact with real-world data, which is essential for many decentralized applications (dApps) to function properly. They provide data such as prices, or other off-chain information that the smart contract needs to make decisions.

An oracle attack can occur when an attacker manipulates the data provided by the oracle to trick the smart contract into executing in an unintended or malicious way. This can lead to undesirable outcomes, financial losses, or security breaches. 

### Key Vulnerabilities:

- **Single Point of Failure:** Relying on a single oracle or a small number of oracles can create a single point of failure. If the oracle is compromised, manipulated, or experiences downtime, the entire smart contract can be affected.
- **Spot Price Manipulation:** A classic vulnerability comes from the world of on-chain price oracles: Trusting the spot price of a decentralized exchange. The scenario is simple. A smart contract needs to determine the price of an asset, e.g., when a user deposits ETH into its system. The protocol consults its respective Uniswap pool as a source to achieve this price discovery. Exploiting this behavior, an attacker can take out a flash loan to drain one side of the Uniswap pool. Due to the lack of data source diversity, the protocol's internal price is directly manipulated. The attacker can now perform an action to capture this additional value.
- **Centralized Oracles and Trust:** Projects can also choose to implement a centralized oracle. Such a smart contract's update method can, e.g., be protected by an `onlyOwner` modifier and require users to trust in the correct and timely submission of data. Depending on the size and structure of the system, this centralized trust can lead to the authorized user(s) getting incentivized to submit malicious data and abuse their position of power.
- **Decentralized Oracle Security:** In a decentralized scenario, further security considerations stem from how participants are incentivized and what misbehavior is left unpunished.
    - **Freeloading:** The simplest form to save work and maximize profit. A node can leverage another oracle or off-chain component (such as an API) and copy the values without validation.
    - **Mirroring:** These are a flavor of Sybil attacks and can go hand-in-hand with freeloading. Similarly, misbehaving nodes aim to save work by reading from a centralized data source with a reduced sampling rate optionally. Due to the lack of transparency in Sybil's communications, mirroring attacks can be tough to detect in practice.

## Remediation:

To mitigate oracle attacks, blockchain developers need to implement proper security measures, such as:

Remediation of oracle attacks in blockchain involves implementing various security measures to mitigate the risks associated with these vulnerabilities. Here are some strategies and best practices to help prevent and address oracle attacks:

1. **Multi-Oracle Approach:** Use multiple independent oracles from different sources to provide the same data. This redundancy helps detect inconsistencies and reduces the likelihood of a single compromised oracle affecting the outcome.
2. **Data Source Diversification:** Use oracles that aggregate data from various sources. This can help mitigate the impact of a single compromised data provider.
3. **Data Verification:** Implement cryptographic proofs or signatures to verify the authenticity of data provided by oracles. This ensures that the data hasn't been tampered with.
4. **Time Stamping:** Include timestamping of data provided by oracles to detect delays or manipulation. Smart contracts can use time-based checks to validate the freshness of the data.
5. **Threshold Signatures:** Require consensus among multiple oracles before accepting data as valid. This prevents a single oracle from maliciously affecting the outcome.
6. **Randomized Oracles:** Use randomized oracles that select data from a pool of sources. This makes it harder for attackers to predict which oracle will be chosen for a specific transaction.
7. **Decentralized Oracles:** Leverage decentralized oracle networks that rely on a larger number of participants to provide and validate data. This can make it more difficult for attackers to manipulate the system.
8. **Off-Chain Data Verification:** Utilize off-chain verification mechanisms to confirm the accuracy of oracle data before it's used in a smart contract. This can involve off-chain computations and data cross-referencing.
9. **Emergency Shutdown Mechanisms:** Implement mechanisms to halt or pause smart contracts in case suspicious oracle behavior is detected. This can help prevent further damage in case of an ongoing attack.
10. **Regular Audits and Monitoring:** Conduct regular security audits of both the smart contracts and the oracle services. Continuous monitoring can help detect unusual behavior and trigger alerts.

## ****Case Study: The Mango Markets Exploit****

The Mango exploiter was able to drain nine figures from Mango by manipulation of the price oracle for the $MNGO token, and then utilized the platforms cross-trading abilities to utilize the now “valuable” $MNGO tokens and withdraw other crypto assets (like stablecoins, USDC, USD and $SOL). Mango Markets was a decentralized exchange (DEX) built on the Solana blockchain. Mango attempted to be a one-stop shop for any trader looking for either spot markets, perpetual futures, and lending.

### The Attack

- The attacker initiated the exploit by funding two wallets with $5,000,000 USDC. Wallet 1 was funded with 5 million USDC with [this transfer](https://explorer.solana.com/tx/66AFLig3vs5XkksTZRh5BPo2iiiPV7jHL3hhjwMe3mRyqC9FG8ELgx3HPCWs8QQy1iSi9BAzm6Wx24fHcTtC1xyC) and the Wallet 2 was then funded with 5 million USDC in [this transfer](https://explorer.solana.com/tx/3cBEK257espSw2X6Z7ZZESPPdcsfBoNLYJGAmXEExxw1QpjkSJfcd9kmtER7LkZ3RGbeXKHv1FR4hRBCD5wA8unY).
- The attacker then used one account to short $488 million MNGO — effectively selling $488 million MNGO on leverage — while the other account took the opposite side of that trade, using leverage to buy the same amount.
- The hacker leveraged purchase of MNGO, combined with further buying of MNGO on other DEXes, pushed the price of MNGO up very quickly on spot exchanges. This was possible because MNGO was a low-liquidity asset without much trading volume.
- The account used to purchase MNGO immediately profited roughly $400 million in paper gains because all of the buying activity significantly boosted the asset’s price.
- With such a high portfolio value, the hacker was able to borrow against his artificially inflated MNGO holdings and remove virtually all of the assets held by Mango Markets.
- This activity caused MNGO’s price to drop immediately, so his long positions were liquidated due to loss of collateral value, but it was too late — he had already “borrowed” all of Mango Market’s assets with any real value.

![image](https://github.com/shubhisaran/Blockchain-Attack-Vectors/assets/113500663/ac876da1-c16e-456e-8ea4-54b7adadfa58)

*We can see this activity on the Chainalysis Storyline*

### ****The Aftermath****

Adding insult to injury, the attacker used the MNGO he still held after the exploit to propose and vote on a governance proposal that would allow him to return $10 million worth of cryptocurrency stolen in the attack, and keep the rest as a “bug bounty.” 

In response, the project team created their own [proposal](https://dao.mango.markets/dao/MNGO/proposal/GYhczJdNZAhG24dkkymWE9SUZv8xC4g8s9U8VF5Yprne) on Oct. 14. As per the proposal, the attacker will return up to $67 million and keep the remaining $47 million as essentially a bug bounty. The proposal also states that they will “waive any potential claims against accounts with bad debt, and will not pursue any criminal investigations or freezing of funds once the tokens are sent back as described above.” Mango tweeted on Oct 15th that $67M in various crypto assets were returned to the DAO.

One of the attackers voluntarily came out and announced himself as the exploiter in a series of tweets, claiming that he operated within the framework of the protocol and that it was “a highly profitable trading strategy” and that it had been “legal open market actions, using the protocol as designed.” Not everyone seemed to agree however, as he was arrested and charged with market manipulation offenses in the Southern District of New York.

*Rodeo Finance recently encountered a similar hack where the attackers extracted around 479 ETH from the system worth approximately $888,000 and the price of the RDO token dropped from $0.2 to $0.08. Read the hack analysis on Rodeo Finance [here](https://www.immunebytes.com/blog/rodeo-finance-hack-analysis-report-july-11-2023/).*
