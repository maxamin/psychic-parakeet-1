## Attack Vectors in Ethereum's Peer-to-Peer Network: A Focus on Eclipse Attacks

### **Introduction to Eclipse Attacks**

An Eclipse Attack occurs when an attacker is able to isolate a target node in a decentralized network, in this case, the Ethereum blockchain, such that all incoming and outgoing connections go through the attacker. This allows the attacker to filter the node's view of the blockchain and manipulate its actions, potentially leading to various types of exploitation. Eclipse Attacks exploit the peer-to-peer nature of decentralized networks and pose serious security risks. This explanation aims to analyze how such an attack could theoretically be executed on an Ethereum node.

### **Meta Information**

- **Attack Vector**: Eclipse Attack on Ethereum P2P Network
- **Target**: Ethereum Node (Version <= geth v1.8.0)

### **Tools and Resources**

- Two host systems, each with a single IP address
- Ethereum Node ID generator
- Timing and synchronisation tools for NTP manipulation
- Packet crafting tools for forced reboot

### **Attack Procedure**

#### **Pre-Attack Phase**

- **Node ID Generation**: Generate thousands of Ethereum Node IDs using minimal computational resources, thanks to Ethereum's use of ECDSA public keys.
- **Node ID Filtering**: Carefully select Node IDs that are more likely to connect to the target based on known biases in Ethereum’s peer-connection logic.
- **Preparation for Connection Monopolization**: Ensure that both attacking host systems are set up and ready to monopolize all connections to and from the target.

#### **Execution**

##### **Stage 1: Isolate Target**

- **Forced Reboot**: Utilize a packet crafting tool to send a packet-of-death to the target Ethereum node, triggering a reboot.
- **Immediate Connection**: As the target node reboots, establish outgoing connections to the target from each of the attacker's host systems.
- **Connection Monopolization**: Occupy all connection slots on the target node, putting the node into an eclipse state. This makes the target node believe that it is still part of the larger Ethereum network, when in reality it is isolated.

##### **Stage 2: Manipulate Target**

- **Blockchain View Manipulation**: Filter the target’s view of the blockchain, enabling the attacker to manipulate what blocks and transactions the target sees.
- **Time Manipulation**: Use NTP to manipulate the target's system clock, making it more than 20 seconds faster than real time.

#### **Post-Attack**

- **Exploitation**: With the target in the eclipse state, initiate double-spending or selfish mining attacks, leveraging the target's mining power to one's advantage.
- **Smart Contract Manipulation**: Use the manipulated view to trick the target into making false transactions in smart contracts, effectively allowing the attacker to engage in fraud.

### **Attack Objectives**

- **Isolate the Target**: Make the target node only connect to the attacker's nodes.
- **Manipulate Blockchain View**: Control the information that the target receives about transactions and blocks.
- **Exploit Vulnerabilities**: Utilize the eclipsed node's resources for double-spending or selfish mining.
- **Smart Contract Manipulation**: Make fraudulent transactions in vulnerable smart contracts.
- **Leave No Trace**: Disconnect and release all monopolized connections, reverting the target to its normal state.

### **Countermeasures**

- **Discontinue ECDSA as a Uniform Node Identifier**: One of the critical vulnerabilities that allows the Eclipse Attack to occur is the use of the ECDSA public key as a uniform node identifier.
- **Adopt a Composite Identifier**: Rather than solely relying on the ECDSA public key, use a composite identifier comprising both the IP address and the public key. This adds an extra layer of complexity for an attacker seeking to monopolize all connections to a target node.
- **Update to Secure Versions**: Versions of geth released after v1.8 have implemented several security measures aimed at preventing such attacks. Therefore, updating to a more recent version is strongly recommended for enhanced security.

### **Reference Paper**

- [Low-Resource Eclipse Attacks on Ethereum’s Peer-to-Peer Network](https://eprint.iacr.org/2018/236.pdf)
