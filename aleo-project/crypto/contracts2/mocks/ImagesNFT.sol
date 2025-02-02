//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ImagesNFT is ERC721 {
    constructor() ERC721("Images", "IMG") { }

    function mint(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }
}
