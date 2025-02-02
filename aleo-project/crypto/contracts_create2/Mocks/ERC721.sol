//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Mock is ERC721 {
    constructor() ERC721("Token", "TOK") { }

    function mint(address _to, uint256 _tokenId) public {
        _mint(_to, _tokenId); 
    }
}