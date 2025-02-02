# Function Default Visibilities

## **Introduction**

Solidity offers four visibility specifiers for functions: public, internal, private, and external. Incorrect use or neglect of these visibilities can lead to vulnerabilities in smart contracts. By default, functions are set to public visibility, allowing them to be called externally. 

## **The Vulnerability**

In Solidity, the default visibility for functions is public. Hence, functions that do not specify visibility are callable by external actors. The problem arises when developers mistakenly omit visibility specifiers for functions intended to be private or internal.

### **HashForEther Contract:**

Let's look at the example derived from [Sigmaprime](https://blog.sigmaprime.io/solidity-security.html#visibility-vuln) blog.

```solidity
contract HashForEther {
    function withdrawWinnings() {
        // Winner if the last 8 hex characters of the address are 0.
        require(uint32(msg.sender) == 0);
        _sendWinnings();
    }

    function _sendWinnings() {
        msg.sender.transfer(this.balance);
    }
}

```

In this contract, the **`_sendWinnings()`** function is intended to be private, but its visibility is not specified. As a result, any external actor can call this function to siphon the contract's balance, even if they are not the legitimate winner.

## **[Real-World Example](https://www.freecodecamp.org/news/a-hacker-stole-31m-of-ether-how-it-happened-and-what-it-means-for-ethereum-9e5dc29e33ce): The Parity MultiSig Wallet Hack**

The Parity MultiSig Wallet hack resulted in a loss of about $31M worth of Ether. Two functions were left as public, allowing an attacker to change ownership and consequently withdraw funds. 

## **Preventative Techniques**

1. **Always Specify Visibility**: Even if a function is intended to be public, always explicitly state its visibility.
2. **Audits and Reviews**: Conduct multiple rounds of security audits, specifically focusing on function visibilities.
3. **Compiler Warnings**: Heed the warnings provided by the Solidity compiler concerning function visibility.
4. **Access Control Patterns**: Implement access control mechanisms like Ownable to restrict access to sensitive functions.

## **Conclusion**

Default visibilities are a potential pitfall that can lead to serious vulnerabilities. Developers should always specify function visibilities and be aware of the associated security implications to prevent unauthorized access and manipulation.
