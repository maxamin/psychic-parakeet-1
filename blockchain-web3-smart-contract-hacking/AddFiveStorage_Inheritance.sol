// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23; // This is solidity version

//Inheritance in Solidity

import{SimpleStorage} from "./SimpleStorage.sol";

contract AddFiveStorage is SimpleStorage {
    //function sayHello() public pure returns (string memory) {
    //    return "Hello";
    //}
    function store(uint256 _newNumber) public override {
        myFavoriteNumber = _newNumber + 5;
    }
}