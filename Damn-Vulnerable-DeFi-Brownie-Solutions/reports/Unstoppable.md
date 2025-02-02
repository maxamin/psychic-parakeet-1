## Unstoppable

### Challenge description

> There's a lending pool with a million DVT tokens in balance, offering flash loans for free.
>
> If only there was a way to attack and stop the pool from offering flash loans ...
> 
> You start with 100 DVT tokens in balance.

### Solution

There's a bug in the UnstoppableLender contract which can be exploited to prevent new flash loans from being offered.

Line 37 in the `flashLoan()` function checks for the current contract token balance:

```solidity
uint256 balanceBefore = damnValuableToken.balanceOf(address(this));
```

This checks for the *real token balance in the contract*. But then, the contract compares it with the variable `poolBalance`:

```solidity
assert(poolBalance == balanceBefore);
```

`poolBalance` can only increase if a deposit is made through the `depositTokens` function:

```solidity
poolBalance = poolBalance + amount;
```

But the actual token balance of the contract can be changed by simply sending tokens to it. And the pool contract has no way of getting rid of these tokens.

If we send 1 token unit to the contract, it will no longer be able to concede any flash loans, as the assertion will always fail.
