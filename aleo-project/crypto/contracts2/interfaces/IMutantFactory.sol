//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IMutantFactory {
    function createMutant(address to, uint256 tokenId) external returns (address);
}
