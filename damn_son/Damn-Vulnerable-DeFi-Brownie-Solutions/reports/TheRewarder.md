## The rewarder

### Challenge description

> There's a pool offering rewards in tokens every 5 days for those who deposit their DVT tokens into it.
>
> Alice, Bob, Charlie and David have already deposited some DVT tokens, and have won their rewards!
>
> You don't have any DVT tokens. But in the upcoming round, you must claim most rewards for yourself.
>
> Oh, by the way, rumours say a new pool has just landed on mainnet. Isn't it offering DVT tokens in flash loans? 

### Solution

The TheRewarderPool mints reward tokens every time it calls `distributeRewards()` and the user has an amount of rewards larger than 0, which is computed as follows:

```solidity
rewards = (amountDeposited * 100 * 10 ** 18) / totalDeposits;
```

To claim such rewards, `isNewRewardsRound()` has to return `true`. The only way this can happen is if it's been 5 days since the last snapshot was taken. 

What we have to do here is deploy an attacker contract that can perform the following steps, this all has to be done _twice_, both times after waiting 5 days<sup><b>*</b></sup>:

* Take a loan from the flash loaner pool of a large amount of tokens, ideally all of them:

```solidity
flashLoanerPool.flashLoan(IERC20(pool.liquidityToken()).balanceOf(address(flashLoanerPool)));
```

Then, in its `receiveFlashLoan()` function:

* Approve the spending limit of the liquidity token to equal the amount borrowed from the flash loaner pool:

```solidity
IERC20(pool.liquidityToken()).approve(address(pool), amount);
```

* Deposit the tokens and then withdraw them. This will call `distributeRewards()` on deposit, which will send the attacker contract all the reward tokens that correspond to it 

```solidity
pool.deposit(amount);
pool.withdraw(amount);
```

* Return the tokens to the flash loaner pool

```solidity
IERC20(pool.liquidityToken()).transfer(address(flashLoanerPool), amount);
```

* Transfer all tokens to the attacker address, which I set up as `owner` during deployment

```solidity
IERC20(pool.rewardToken()).transfer(address(owner), IERC20(pool.rewardToken()).balanceOf(address(this)));
```

<sup><b>*</b></sup> Since the challenge is designed to work on a local testnet, I believe it to be acceptable to run a command like `evm_increaseTime`, however, if this were on a live network, we would have a window of time to run the `distributeRewards()` after calling `deposit()` with a really large amount of tokens in order to skew rewards so much that we essentially capture almost all of them when `distributeRewards()` is called and `isNewRewardsRound()` returns `true`. The attacker contract needs to be the _first_ address that calls `distributeRewards()` because it is called _during_ the transaction in which the attacker contract has all the borrowed funds from the flash loan, if anyone _else_ calls `distributeRewards()` before the flash loan is taken or after it's returned, the reward tokens are correctly distributed.
