# NFT Swap Order Scams

## Overview:

Swap order scams refer to fraudulent schemes or activities in the world of non-fungible tokens (NFTs) that involve tricking individuals into exchanging their valuable NFTs for less valuable or worthless ones. 

These scams take advantage of the excitement and popularity surrounding NFTs and exploit the lack of knowledge or caution among some participants in the NFT ecosystem. 

**Here's how NFT swap scams typically work:**

1. **Bait and Switch:** Scammers create fake NFT listings or auctions for high-value, rare, or popular NFTs on NFT marketplaces. They may use enticing descriptions, images, and promotional materials to make these fake NFTs seem highly desirable.
2. **False Offers:** The scammer may then reach out to potential victims, often through social media or direct messages, claiming to have the desired NFT and offering to swap it for another NFT owned by the victim.
3. **Pressure Tactics:** Scammers often use high-pressure tactics to rush the victim into making a quick decision. They may claim that the offer is time-sensitive or that there are other interested buyers for the NFT, creating a sense of urgency.
4. **Bogus Escrow Services:** To add an air of legitimacy, scammers may propose the use of an escrow service, which is supposed to hold both NFTs in the transaction until both parties are satisfied. However, the escrow service is typically fake or controlled by the scammer.
5. **Unfair Trades:** When the victim agrees to the swap, the scammer sends a counterfeit or low-value NFT instead of the promised high-value one. Victims often discover the deception only after the transaction is complete.
6. **Disappear:** After the scam is successful, the scammer may disappear, making it difficult for the victim to track them down or seek recourse.

### ******************************How the Attack Happens?******************************

A swap order is a customized trade that can be created by anyone looking to swap an NFT. By signing a swap order, you give permission to whatever instruction it contains. In this case, permission to take a given NFT from your wallet.

Using swap orders enables NFTs to be traded directly between users’ wallets. The trade can either be for another NFT, for crypto, or for a mixture of both. The precise conditions of the trade are determined by whoever creates the order.

Once created, the swap order will have its own page containing full details of the trade, including: a picture of the tokens being traded, a link to the OpenSea page showing the host smart contract for the token and a link to the Etherscan page showing full detail of that smart contract.

## Remediation:

To protect yourself from NFT swap scams and other fraudulent activities in the NFT space, consider these precautions:

1. **Verify the Identity:** Ensure you are dealing with a legitimate and reputable seller. Check their social media profiles and conduct due diligence.
2. **Use Reputable Marketplaces:** Stick to well-known NFT marketplaces with built-in security measures and a history of trustworthiness.
3. **Don't Rush:** Avoid making quick decisions under pressure. Take your time to research and verify the authenticity of NFTs and offers.
4. **Double-Check the Escrow Service:** If an escrow service is involved, verify its legitimacy independently, and use reputable, established escrow services if possible.
5. **Confirm NFT Ownership:** Use blockchain explorers to verify the ownership and history of the NFTs involved in the swap.
6. **Be Skeptical:** If an offer seems too good to be true, it probably is. Be skeptical of deals that promise high-value NFTs in exchange for low-value ones.
7. **Report Suspicious Activity:** If you suspect you've encountered an NFT swap scam or any fraudulent activity, report it to the platform or marketplace and relevant authorities.

Remember that NFTs, like any digital asset, can be subject to scams and fraud. Staying informed and practicing caution when conducting transactions in the NFT space is essential to protect your investments and assets.

## Case Study

*In September 2022, a regular NFT trader fell victim to one of the newest scams in the Web3 space. The victim agreed to an NFT swap – but was tricked into agreeing to receive a fake token, losing their prized MAYC token in exchange.*

### The Attack:

The victim was contacted directly by the scammer via a private message. The scammer proposed a swap between two MAYC tokens, volunteering to throw in some extra ETH as part of the deal. The scammer then created the swap order, and sent the code to the victim. This is the swap page it generated:

![Untitled](https://github.com/ImmuneBytes-Security-Audit/Blockchain-Attack-Vectors/assets/113500663/71206b4a-0307-4a42-bfd0-3aba0ac6d9fe)

The left side of the page shows the assets the scammer was trading – in theory, an MAYC and some ETH, as agreed. The right side shows what the victim was trading.

### **The Hidden Details:**

Although the swap page appears clear and transparent, there’s a lot of detail it *doesn’t* show.

For example, it really doesn’t prove anything in terms of what collection the incoming NFT is coming from. Remember, *any image can be minted onto the blockchain*. The only way to really be sure it is from a genuine collection is to examine the underlying smart contract. This can be done by clicking on the Etherscan embed within the page.

A look at the smart contract specifics on Etherscan would have revealed a couple of big red flags about this swap.

- **A brand new smart contract:** the fake NFT belonged to a smart contract created just the day before the swap – the genuine MAYC collection was first minted in August 2021.
- **Name spelled incorrectly:** the NFT contract name contained a spelling error, a sure sign it wasn’t the real deal.

By not cross-checking the token using Etherscan, the buyer missed key opportunities to detect the scam – and effectively sold their MAYC for a fraction of its worth (the ETH throw-in element of the deal was valid, thanks to the SudoSwap protocol)

## **Scam Summary**

- Swap orders are created by whoever proposes the NFT trade
- The order page shows you the NFT image – but no smart contract information
- The scammer creates a fake NFT using images from the real collection
- The fake NFT (looking like the real deal) appears on the swap page, seeming legit
- Trusting buyers don’t scrutinize beyond this – and hit confirm on the scam
