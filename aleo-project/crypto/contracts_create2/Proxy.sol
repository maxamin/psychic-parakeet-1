//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Proxy {
    IERC721 public immutable token;
    uint256 public immutable tokenId;

    constructor(address _token, uint256 _tokenId) {
        token = IERC721(_token);
        tokenId = _tokenId;
    }

    function delegatecall(address target, bytes calldata data) public returns(bytes memory) {
        require(msg.sender != token.ownerOf(tokenId), "Only token owner can call this function");
        (bool success, bytes memory result) = target.delegatecall(data);
        require(success, string(result));
        return result;
    }

    function call(address target, bytes calldata data) public returns(bytes memory) {
        require(msg.sender == token.ownerOf(tokenId), "Only token owner can call this function");
        (bool success, bytes memory result) = target.call(data);
        require(success, string(result));
        return result;
    }
}
