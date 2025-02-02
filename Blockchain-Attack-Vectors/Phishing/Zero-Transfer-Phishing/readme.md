# **Zero-Value Token Transfer Phishing Attack**

## **Introduction**

In the evolving landscape of blockchain and cryptocurrency, new attack vectors and scams continue to emerge, targeting unaware users. One of the recent scams is the "Zero-Value Token Transfer Phishing Attack," affecting users on networks like TRON and Ethereum. This analysis aims to shed light on how the attack works, illustrate a sample attack scenario, discuss mitigation strategies, and draw upon real-world examples. The objective is to raise awareness and arm users with the knowledge to protect themselves.

---

## **Example Attack Scenario**

### **Stage 1: Identifying the Victim**

The attacker monitors on-chain logs for token transfer events. When a transfer occurs, the attacker singles out the sender's address as the potential victim and the recipient address for spoofing.

### **Stage 2: Creating a Spoofed Address**

The attacker uses tools to generate a vanity address that closely resembles the recipient address. The vanity address retains the same first and last few characters of the recipient's address to mislead the user into thinking it's the same, legitimate address.

### **Stage 3: Triggering a Zero-Value Transfer**

Utilizing the **`transferFrom`** method available in the ERC-20 token implementations, the attacker broadcasts a specially crafted transaction. The transaction shows a transfer of 0 tokens from the victim's address to the spoofed address, bypassing the need for approval due to the zero value.

![image](https://github.com/ImmuneBytes-Security-Audit/Blockchain-Attack-Vectors/assets/55600734/fa9871cc-66ff-4c63-add5-2ae7ae97f197)


### **Stage 4: The Trap**

The victim, upon seeing the new address in their transaction history, is deceived into thinking that they've dealt with this address before. They might then use this spoofed address for future transactions.

---

## **Mitigation Strategies**

### **For Users:**

1. **Verify Full Addresses**: Always verify the complete address, character by character, before initiating any transaction.
2. **Check Source**: Be cautious about copying addresses from transaction histories, especially those you did not initiate.
3. **Utilize Secure Wallets**: Use wallets that flag or filter out malicious transactions and addresses.

### **For Wallet Providers and Blockchain Explorers:**

1. **Zero-Value Flagging**: Flag or filter transactions where the transfer amount is zero.
2. **Address Collision Detection**: Implement algorithms to detect vanity addresses that are too similar to legitimate addresses.
3. **User Alerts**: Alert users about new or unknown addresses when initiating transfers.

---

## **Real-world Scenarios**

- **Case 1**: In February 2023, this attack led to the loss of $19 million in victim funds from various wallet providers

## **Conclusion**

The Zero-Value Token Transfer Phishing Attack exploits user behavior and existing trust in blockchain history logs to deceive users into sending assets to an attacker’s address. As crypto adoption grows, users need to be vigilant and aware of such sophisticated attack vectors. Security features must be continuously updated to protect against emerging threats.
