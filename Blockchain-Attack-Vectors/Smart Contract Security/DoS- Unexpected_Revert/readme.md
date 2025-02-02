### Attack Vector: **DoS with Unexpected Revert**

### Introduction

Denial of Service (DoS) attacks are not just limited to conventional web servers; they can also be executed against blockchain smart contracts. One such attack vector in the Solidity ecosystem is the "DoS with Unexpected Revert." This attack exploits weaknesses in how smart contracts handle reverts and errors, ultimately leading to a denial of service.

### The Nature of Reverts in Smart Contracts

When a smart contract operation fails for any reason, it reverts the changes. The Ethereum Virtual Machine (EVM) handles these errors with two OPCODES, **`REVERT (0xFD)`** and **`INVALID (0xFE)`**. The **`REVERT`** opcode stops the contract execution and returns the remaining gas to the caller, while **`INVALID`** halts the contract execution without returning any gas.

### The Attack Scenario: Auction Contract

Let's consider an example of a vulnerable Solidity contract called **`SimpleAuction`**.

```solidity
solidityCopy code
pragma solidity ^0.8.0;

contract SimpleAuction {
    address public currentHighestBidder;
    uint public highestBid;

    function bid() external payable {
        require(msg.value > highestBid, "Bid must be higher than the current highest bid");

        uint refundAmount = highestBid;
        address previousHighestBidder = currentHighestBidder;

        currentHighestBidder = msg.sender;
        highestBid = msg.value;

        payable(previousHighestBidder).transfer(refundAmount);
    }
}

```

### Vulnerability Details

In this contract, a user makes a bid by sending Ether along with the **`bid()`** function call. The contract checks if the new bid is higher than the current highest bid. If it is, the contract transfers the previous highest bid amount back to the previous highest bidder. The new highest bid becomes the **`highestBid`**, and the sender becomes the **`currentHighestBidder`**.

The flaw here is that if the **`currentHighestBidder`** is a contract without a payable fallback function, the **`transfer`** method will fail, leading to an unexpected revert.

### Attack Execution

An attacker, Alice, deploys a contract that deliberately fails to accept Ether:

```solidity
solidityCopy code
contract MaliciousBidder {
    function() external {
        revert("I do not accept Ether");
    }
}

```

She then uses this contract to become the **`currentHighestBidder`**. Now, when Bob tries to outbid Alice, the **`transfer`** method fails because Alice's contract does not accept Ether, causing an unexpected revert and locking the auction contract.

### Mitigation: Pull Over Push Design Pattern

A better approach to handle such scenarios is to use the "[Pull Over Push](https://fravoll.github.io/solidity-patterns/pull_over_push.html)" design pattern.

```solidity
solidityCopy code
pragma solidity ^0.8.0;

contract SecureAuction {
    address public currentHighestBidder;
    uint public highestBid;
    mapping(address => uint) public bidBalances;

    function bid() external payable {
        require(msg.value > highestBid, "Bid must be higher than the current highest bid");

        bidBalances[currentHighestBidder] += highestBid;

        currentHighestBidder = msg.sender;
        highestBid = msg.value;
    }

    function withdraw() external {
        uint amount = bidBalances[msg.sender];
        bidBalances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}

```

### Conclusion

Unexpected reverts can cripple the functionality of a smart contract, leading to a denial of service. It is crucial to employ well-tested design patterns like "Pull Over Push" to mitigate such vulnerabilities.
