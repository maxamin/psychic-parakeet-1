## Truster

### Challenge description

> More and more lending pools are offering flash loans. In this case, a new pool has launched that is offering flash loans of DVT tokens for free.
>
> Currently the pool has 1 million DVT tokens in balance. And you have nothing.
>
> But don't worry, you might be able to take them all from the pool. In a single transaction.

### Solution

After the TrusterLenderPool transfers borrowed tokens to the borrower, it runs the following call to a specified `target` contract which is supposed to perform certain actions in behalf of the borrower (as the borrower programs it) with the tokens and is supposed to return the tokens back into the pool:

```solidity
target.functionCall(data);
```

However, there is no restriction as to which contract can be passed as `target`, therefore we can pass any contract address, including that of the DVT token contract.

The way I chose to solve this challenge is by passing the DVT token contract and calling `approve()` passing the attacker address as spender and with `TOKENS_IN_POOL` as the spending limit.

After the approval, I drained all the pool funds by calling `transferFrom()`.
