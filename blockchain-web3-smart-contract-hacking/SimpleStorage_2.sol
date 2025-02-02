// SPDX-License-Identifier: MIT
pragma solidity 0.8.23; // This is solidity version

contract SimpleStorage {
    uint256 public favoriteNumber;
    function store(uint _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
    }
    // view and pure keywords
    function retrive() public view returns(uint256) {
        return favoriteNumber;
    }
    //pure keyword will disallow both read and write in the function
}