# Governance Risks Associated With Blockchains

## Description:

Managing and implementing changes to cryptocurrency blockchains via voting is called governance. Any changes or updates to a blockchain protocol are implemented through this type of governance. Each token holder can vote to accept or reject proposed modifications by developers through code updates. If a governance proposal reaches beyond *quorum*, the proposed change will be implemented, but if rejected, the changes won’t be made in the protocol.

In the context of blockchains, "**Governance Attacks**" typically refer to malicious actions or strategies aimed at disrupting the governance mechanisms and decision-making processes within a blockchain network.

### Some of the most prominent vulnerabilities:

- **Big bags, higher voting power:** The holder having a massive chunk of tokens has more voting power than the one with fewer tokens. This means if a person has more than the number of tokens required to pass a proposal, they can make any decision for the protocol single-handedly.
- **Less participation:** There are chances that some of the governance proposals are too technical and that not every holder can understand them properly and make the right decision. For example, a chain upgrade proposal to upgrade the software version. These are hard to understand by an average person, making it difficult for them to make the right decision.
- **Influenced decisions:** This is the most common one, as so many factors could easily influence holders. This could be done through paid PR campaigns, influencer marketing, or even by bribing people to have a biased say on the proposal.
- **Spamming:** Any person could raise a governance proposal by depositing a certain amount of tokens of that chain. This could result in spam proposals. It mainly happens if the token price falls low that raising a proposal costs just a few dollars.

## Remediation:

To mitigate the risks associated with governance in blockchain, several measures can be implemented:

- When the token price is low and anyone can afford the number of tokens required to raise a proposal, make sure to increase the deposit amount needed to submit a proposal to a significant value to protect against spam proposals.
- Employ various strategies, such as implementing strong governance mechanisms and using decentralized voting systems.
- Educate your community about the importance of governance proposals and why they should participate. This plays a significant role and helps them stay unaffected by any improper influence.
- The protocols and the core team should ensure that the project undergoes security audits and take necessary steps to avoid any governance attack.

## ****Case Study: The Beanstalk Stablecoin Hack****

Beanstalk Farms, an Ethereum-based stablecoin protocol, was exploited for $182 million on 17th April, 2022. In this incident, the attacker took out a flash loan on lending platform Aave, which was used to amass a large amount of Beanstalk’s native governance token, $STALK.

### Attack

Beanstalk bills itself as a "decentralized credit-based stablecoin." A stablecoin is a cryptocurrency designed to hold a 1:1 peg with a fiat currency such as the U.S. dollar. While the top stablecoins, Tether and USDC, do that by ostensibly holding cash and other collateral in the bank, Beanstalk uses an algorithm to ensure BEAN holds its value.

That means that Beanstalk doesn't use collateral, either of the fiat variety or tokens (like with Dai). Its credit-based system theoretically helps limit supply shortages because it's not limited by the amount of collateral people can bring; creditors fill the gap.

The hacker used an accumulation of governance tokens, obtained through a flash loan. Flash loans allows people to borrow an asset to make a quick trade and then repay the asset — all in just one complex transaction that involves multiple protocols. The exploiter used the governance tokens to create a fake protocol improvement proposal to gift funds held in Beanstalk to an address used to raise donations for the government of Ukraine.

The attacker laundered all stolen funds through Tornado Cash, which enables users to send and receive crypto while obfuscating its source.
