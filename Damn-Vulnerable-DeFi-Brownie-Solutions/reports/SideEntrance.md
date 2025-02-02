## Side entrance

### Challenge description

> A surprisingly simple lending pool allows anyone to deposit ETH, and withdraw it at any point in time.
>
> This very simple lending pool has 1000 ETH in balance already, and is offering free flash loans using the deposited ETH to promote their system.
>
> You must take all ETH from the lending pool.

### Solution

SideEntranceLenderPool's `flashLoan()` function expects to interact with a contract and call its `execute` function forwarding the value that the borrower requests (`amount`). This contract is open to reentrancy vulnerabilities and it can be exploited to drain its funds.

Then, the `flashLoan()` function checks the following:

```solidity
require(address(this).balance >= balanceBefore, "Flash loan hasn't been paid back"); 
```

Meaning the funds can be returned to the contract through `deposit()`:

```solidity
function execute() external payable {
    pool.deposit{value: msg.value}();
}
```

Given the reentrancy vulnerability, we can call `deposit()` in `execute()` with the funds obtained from the flash loan, which credits them to the attacker contract address in the `balances` mapping.

This entitles the attacker contract to withdrawing the full pool contract balance, which can be then forwarded to the attacker address:

```solidity
function withdrawFromPool() external payable {
    pool.withdraw();
}

receive() external payable {
    payable(owner).sendValue(msg.value);
}
```
