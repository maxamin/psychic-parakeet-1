# **At Risk: Blockchain Bridges; Off-Chain Components**

## **Description:**

Blockchain bridges are crucial components in the blockchain ecosystem, enabling interoperability between different blockchain networks. However, they also present a significant risk due to their reliance on off-chain details. These components, including validator nodes, key management systems, and operational processes, can be vulnerable to various attacks, leading to significant security breaches.

### **Kinds of Vulnerabilities**

One of the most prominent risks is the potential for attackers to exploit vulnerabilities in these off-chain components to gain unauthorized access to the bridge and, consequently, to the connected blockchain networks. This type of attack, often called a "bridge exploit" or "multichain attack," allows attackers to move laterally through the environment, accessing valuable assets across multiple blockchain networks.

For instance, an attacker might exploit a vulnerability in a smart contract on one network to gain access to the bridge, then use that access to pivot to other connected networks. This lateral movement can significantly broaden the attack surface, allowing the attacker to access and potentially steal valuable assets across multiple networks.

Another risk associated with off-chain components is operational failure. A cross-chain bridge's operation involves managing various parts, potentially by distinct actors. Failures and oversights in these operational activities can present a significant source of risk to protocols. Privileged parties (bridge administrators) might be able to control the bridge's parameters and negate security controls in the protocol's design.

### **Components at Risk**

Validator nodes, which are responsible for verifying transactions and maintaining the integrity of the blockchain, can be compromised through various attack vectors. For instance, a spear-phishing attack could trick a node operator into revealing sensitive information, allowing an attacker to gain control of the node. Once a node is compromised, the attacker can manipulate transactions, create fraudulent blocks, or disrupt the network's operation.

Key management systems, which store and manage the cryptographic keys used for transaction signing and authentication, are another potential weak point. If an attacker gains access to these keys, they can sign fraudulent transactions or even take control of user accounts.

Operational processes, such as upgrading and managing bridge smart contracts and operating off-chain systems, can also present vulnerabilities. For instance, a poorly implemented upgrade could introduce new vulnerabilities into the smart contract, or a misconfigured off-chain system could expose sensitive information.

## **Remediation:**

To mitigate the risks associated with off-chain components in blockchain bridges, several measures can be implemented:

1. **Robust, Decentralized, and Transparent Management Systems:** Having robust, decentralized, and transparent mechanisms and processes for managing such systems is crucial to ensuring the security of cross-chain bridges.
2. **Operational Security Practices:** Employing clear and robust security practices, policies, and procedures across the stack is critical. This includes using multi-factor authentication, implementing network segmentation to restrict lateral movement, and conducting regular security audits and vulnerability assessments to identify and address potential weaknesses.
3. **Monitoring and Incident Response:** Robust monitoring for anomalous activities is essential for early detection of potential attacks. Additionally, having clear and timely incident response processes can help mitigate the impact of an attack when it occurs.
4. **Secure Communication Channels:** Implementing secure communication channels between blockchains can prevent unauthorized access and reduce the risk of multichain attacks.
5. **Access Control Mechanisms:** Implementing robust access control mechanisms and limiting the exposure of sensitive information can help prevent unauthorized access to the bridge and the connected networks.
6. **Blockchain-Specific Security Solutions:** Consider implementing blockchain-specific security solutions, such as smart contract audits and token-allow listing, to reduce the risk of multichain attacks.
7. **Robust Key Management:** Implement secure key management practices, including hardware security modules (HSMs) and multi-signature wallets. Regularly rotate keys and use separate keys for different purposes to limit the potential damage if a key is compromised.
8. **Secure Validator Nodes:** Implement robust security measures for validator nodes, including firewalls, intrusion detection systems, and regular security audits. Please ensure that node operators are trained in security best practices and aware of the latest threats.

# **References:**

A real-world example of the risks associated with off-chain components in blockchain bridges is the Ronin Hack. In this incident, attackers used a spear-phishing attack on a Sky Mavis engineer to access key IT systems. They compromised all 4 of Sky Mavis' validator nodes and used a backdoor to obtain signatures from Axie DAO, thereby having 5/9 signatures required to compromise the bridge. This led to the theft of ~$624M in funds from the bridge contract on Ethereum. The hack was not detected until six days later. This case study underscores the importance of robust operational security practices and the need for effective monitoring and incident response processes.

## **Case Study: The Ronin Bridge Hack**

The Ronin Bridge hack is a stark reminder of the vulnerabilities associated with off-chain components in blockchain bridges. In this incident, attackers exploited a combination of social engineering and technical vulnerabilities to steal approximately $624 million in funds from the bridge contract on Ethereum.

### **The Attack**

The attackers initiated their operation with a spear-phishing attack on a Sky Mavis engineer. Spear-phishing is a targeted form of phishing where the attacker researches their victim and tailors their approach to appear more legitimate. In this case, the attackers successfully tricked the engineer into revealing sensitive information, which they used to gain access to key IT systems.

Once inside, the attackers compromised all four of Sky Mavis's validator nodes. These nodes are critical components of the blockchain infrastructure, responsible for verifying transactions and maintaining the integrity of the network. With control over the validator nodes, the attackers could manipulate transactions and disrupt the network's operation.

The attackers then used a backdoor to obtain signatures from Axie DAO. The DAO, or Decentralized Autonomous Organization, is represented by rules encoded as a transparent computer program controlled by the organization members and not influenced by a central government. In this case, the attackers needed 5 out of 9 signatures to compromise the bridge, and with the signatures from Axie DAO, they achieved their goal.

With control over the bridge, the attackers stole approximately $624 million in funds from the bridge contract on Ethereum. The stolen funds included a variety of cryptocurrencies, demonstrating the potential for large-scale theft in such attacks.

### **The Aftermath**

The attack was not detected until six days later when a user noticed their withdrawal attempts on the bridge were failing. This delay in detection underscores the importance of robust monitoring systems and rapid incident response.

In response to the attack, Sky Mavis implemented several measures to improve their security. They increased the number of validators to 11, with plans to reach 21 validators over the next few months. They also went through two external audits, which uncovered other critical vulnerabilities to be addressed. Additionally, they added a circuit breaker to limit the amount of funds that can be withdrawn without human intervention and improved their internal security practices, procedures, and tools.

Despite these measures, the attack significantly impacted the Ronin network and its users. The treasury and founding team had to replace the stolen funds, and the bridge was closed for several months. The incident is a stark reminder of the risks associated with off-chain components in blockchain bridges and the importance of robust security measures.
