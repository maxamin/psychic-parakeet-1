# **Entropy Illusion: The Mirage of Randomness in Smart Contracts**

## **Introduction**

The blockchain ecosystem, including Ethereum, operates on deterministic principles where transactions lead to predictable state changes. The deterministic nature poses a challenge for generating randomness, a key component for applications like gambling. This has led developers to employ various techniques, often problematic, to approximate randomness or entropy within smart contracts.

## **The Vulnerability**

The absence of inherent randomness in blockchain poses a challenge, especially for smart contracts that function as "the house" in gambling applications. A frequent mistake is to rely on block variables like hashes, timestamps, block numbers, or gas limits for generating random outcomes.

### **Roulette Smart Contract:**

Imagine a smart contract simulating a roulette game. The contract may use the last digit of the next block's hash to determine if the spin results in red or black. A miner or a mining pool could place a large bet and intentionally manipulate the block hash they produce to ensure they win. Essentially, relying on block variables can be gamed, as they are not truly random and are controllable to some extent by the miner.

```solidity
contract Roulette {
    function spinWheel() public returns (string memory) {
        uint256 blockValue = uint256(blockhash(block.number - 1));
        if (blockValue % 2 == 0) {
            return "Black";
        } else {
            return "Red";
        }
    }
}

```

## **[Real-World Example](https://blog.positive.com/predicting-random-numbers-in-ethereum-smart-contracts-e5358c6b8620): PRNG Contracts**

A real-world case study reveals the risks involved. Arseny Reutov analyzed 3,649 live smart contracts using pseudo-random number generators (PRNG) and found 43 exploitable contracts. These contracts were vulnerable due to poor approximations of randomness.

## **Preventative Techniques**

1. **External Randomness**: Employ external randomness sources such as commit-reveal schemes among peers or oracles that provide random data.
2. **Changing Trust Model**: Consider using decentralized solutions like RandDAO for sourcing randomness.
3. **Avoid Block Variables**: Do not rely on variables like blockhash or timestamp for generating random numbers as they can be manipulated.

## **Conclusion**

The illusion of entropy in deterministic systems like blockchain can be perilous, leading to smart contracts that are vulnerable to manipulation. Developers need to be cautious and employ robust methods for approximating randomness to safeguard against potential exploits.
