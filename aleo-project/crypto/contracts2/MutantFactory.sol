//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Mutant.sol";
import "./SingletonFactory.sol";
import "./interfaces/IMutantFactory.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MutantFactory is IMutantFactory, ERC721, SingletonFactory {
    constructor() ERC721("MutantFactory", "MTF") { }

    event MutantCreated(
        uint indexed tokenId,
        address indexed mutant
    );

    mapping(uint256 => address) public _mutantAddressById;
    mapping(address => uint256) public _mutantIdByAddress;

    function createMutant(address to, uint256 tokenId) external override returns (address) {
        _mint(to, tokenId);

        address mutant = address(new Mutant(address(this), tokenId));

        _mutantAddressById[tokenId] = mutant;
        _mutantIdByAddress[mutant] = tokenId;

        emit MutantCreated(
            tokenId,
            mutant
        );

        return mutant;
    }
}
