# **Reward Not Updated Vulnerability in NFT Staking Contracts**

## **Introduction**

The decentralized nature of blockchain technology and smart contracts has ushered in a new era of trustless transactions. However, vulnerabilities can arise, particularly when smart contracts have logical flaws. One such vulnerability, the "Rewards not Updated" flaw, can allow users to exploit staking rewards in NFT staking contracts, leading to significant losses for platforms.

---

## **Example Attack Scenario**

### **Stage 1: Identifying the Vulnerability**

The attacker identifies a flaw in an NFT staking contract, realizing that rewards aren't updated upon restaking tokens. This oversight means that the staking state doesn't get refreshed, permitting repeated restaking without resetting rewards.

### **Stage 2: Exploitation**

Using this vulnerability, the attacker stakes their tokens and then restakes multiple times without updating the rewards. This action leads to inflated rewards due to the contract's inability to update the staking state properly.

### **Stage 3: Reaping Rewards**

The attacker then claims their rewards, which have been artificially inflated due to the continuous restaking. The platform, unaware of the exploitation, grants the excessive rewards, leading to potential losses.

---

## **Real-World Scenario**

The $Quint token, as audited by CertiK, experienced this vulnerability, which resulted in an approximate loss of ~100k. An **[attacker's address](https://bscscan.com/address/0x6e2c2c94669abe05b8193ea138cc88888888cc25)** was identified that showcased suspicious transactions, revealing the loophole. The root cause was identified in the **[$Quint staking contract](https://bscscan.com/address/0x8FD50c8886dc91111E52BBFcb2685368c29Bdc8d)** that neglected to update the restaking. This neglect permitted infinite restaking, which hackers utilized, and copycats prepared to exploit over several days.

---

## **Mitigation Strategies**

### **For Developers:**

- **Regular Audits**: Ensure smart contracts are audited by trusted firms before launching them. Regular post-launch audits can also detect emerging vulnerabilities.
- **Update Staking States**: Implement mechanisms to update staking states and rewards upon every stake or restake action.
- **Engage with the Community**: Maintain open communication with the user community. Address concerns and be open to feedback, as some users might detect vulnerabilities early.

### **For Users:**

- **Verify Contract Logic**: If possible, users should review or seek insights about a staking contract's logic before staking large amounts.
- **Monitor Rewards**: Monitor rewards and staking activities frequently. If rewards seem abnormally high, it could be an indication of an underlying issue.
- **Engage with Dev Teams**: Report any irregularities to the development teams immediately and reduce stakes if issues persist.

---

## **Conclusion**

The "Rewards not Updated" vulnerability underscores the importance of robust smart contract design and frequent audits. While decentralized systems offer autonomy and trustlessness, they are not devoid of vulnerabilities. Developers need to remain vigilant, and users must stay informed and cautious. Only through collaboration can the decentralized ecosystem remain secure and reliable.
