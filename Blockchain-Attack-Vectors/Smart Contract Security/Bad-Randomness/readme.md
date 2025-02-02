
# **Bad Randomness in Solidity Smart Contracts**

## **Introduction**

Bad randomness, often referred to as the "nothing is secret" attack, is a vulnerability in Solidity smart contracts deployed on the Ethereum blockchain. This attack vector exploits the pseudo-random nature of certain variables and functions in Solidity, allowing an attacker to predict or influence the outcome of smart contract operations that rely on randomness.

## **Vulnerability Points**

### **1. Using Block Hash for Randomness**

**Code Example:**

```solidity
solidityCopy code
function randomNumber() public view returns (uint) {
    return uint(keccak256(abi.encodePacked(block.difficulty))) % 10;
}

```

**Attack Vector:**

An attacker can monitor the block difficulty and potentially influence it by colluding with miners. By doing so, the attacker can predict the output of the **`randomNumber()`** function.

### **2. Using Block Timestamp for Randomness**

**Code Example:**

```solidity
solidityCopy code
function randomNumber() public view returns (uint) {
    return uint(keccak256(abi.encodePacked(block.timestamp))) % 10;
}

```

**Attack Vector:**

An attacker who controls a miner can manipulate the block timestamp, thereby influencing the output of the **`randomNumber()`** function.

### **3. Using Block Number for Randomness**

**Code Example:**

```solidity
solidityCopy code
function play() public payable {
    require(msg.value >= 1 ether);
    if (block.blockhash(blockNumber) % 2 == 0) {
        msg.sender.transfer(this.balance);
    }
}

```

**Attack Vector:**

An attacker can create a malicious contract that checks if the current block number is a winner. If so, it calls the vulnerable smart contract, ensuring a win since the block number remains constant within the same transaction.

## **Real-World Impact**

- Loss of more than 400 ETH in [SmartBillions Lottery.](https://www.reddit.com/r/ethereum/comments/74d3dc/smartbillions_lottery_contract_just_got_hacked/)
- [TheRun](https://hrishiolickel.medium.com/why-smart-contracts-fail-undiscovered-bugs-and-what-we-can-do-about-them-119aa2843007)

## **Mitigation**

1. Use hardware random number generators (RNGs) for generating truly random numbers.
2. Utilize decentralized randomness beacons like Chainlink's VRF.

## **Conclusion**

Bad randomness is a  attack vector in Solidity smart contracts. Developers must be cautious when implementing randomness and should opt for secure and unpredictable sources to mitigate this risk.
