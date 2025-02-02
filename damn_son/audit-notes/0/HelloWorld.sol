// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld{
    function hello()public view returns (string memory){
        require(msg.sender == tx.origin, "No contracts allowed");
        return "Hello world";
    }
}