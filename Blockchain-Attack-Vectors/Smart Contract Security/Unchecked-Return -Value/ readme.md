# ****Unchecked Return Values****

### ****The Underlying Issue****

In Solidity, developers can perform external calls using various methods like **`send()`**, **`call()`**, and **`transfer()`**. However, each of these has a different behaviour when it comes to error handling:

- **`send()`** and **`call()`** return a boolean value (**`true`** or **`false`**) indicating the success or failure of the operation. A common pitfall is failing to check this return value. If the external call fails, these methods will not revert the entire transaction but will simply return **`false`**.
- **`transfer()`**, conversely, reverts the entire transaction if the external call fails, serving as a more failsafe method for transferring Ether.

Failure to properly handle these return values or understand the nuances between these methods can lead to vulnerabilities in the contract, opening up opportunities for exploits.

### ****The Lotto Contract:****

Let's look at the example derived from [Sigmaprime](https://blog.sigmaprime.io/solidity-security.html#short-address) blog.

```solidity
contract Lotto {

    bool public payedOut = false;
    address public winner;
    uint public winAmount;

    // ... extra functionality here

    function sendToWinner() public {
        require(!payedOut);
        winner.send(winAmount);
        payedOut = true;
    }

    function withdrawLeftOver() public {
        require(payedOut);
        msg.sender.send(this.balance);
    }
}
```

### ****The Trap****

The core issue lies, where the contract uses **`send()`** without checking its return value. If the external call fails due to a variety of possible reasons (e.g., gas limitations, malicious fallback functions), the variable **`payedOut`** would still be set to **`true`**. This essentially allows anyone to withdraw the remaining funds using the **`withdrawLeftOver()`** function even if the winner has not actually received their reward.

### ****Preventative Measures****

1. **Use Transfer Over Send**: Whenever possible, use **`transfer()`** instead of **`send()`** since the former reverts the transaction if the external call fails.
2. **Check Return Values**: Always validate the return value of **`send()`** or **`call()`** functions to take appropriate actions if they return **`false`**.
3. **Adopt a Withdrawal Pattern**: Employing a withdrawal pattern ensures that the end-user will call a separate function to complete the transaction, thus allowing the contract to handle external call failures more gracefully.

### ****Conclusion****

The unchecked return values vulnerability may seem trivial, but it can lead to significant consequences including fund loss. Developers should not underestimate the power of return values and should adopt best practices to safeguard their contracts against such vulnerabilities.
