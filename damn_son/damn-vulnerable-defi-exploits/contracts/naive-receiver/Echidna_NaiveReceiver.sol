//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./NaiveReceiverLenderPool.sol";
import "./FlashLoanReceiver.sol";

contract Echidna_NaiveReceiver {
    uint256 constant ETHER_IN_POOL = 1000 ether;
    uint256 constant ETHER_IN_RECEIVER = 10 ether;

    NaiveReceiverLenderPool pool;
    FlashLoanReceiver receiver;

    constructor() payable {
        pool = new NaiveReceiverLenderPool();
        receiver = new FlashLoanReceiver(payable(address(pool)));
        address(pool).call{value: ETHER_IN_POOL}("");
        address(receiver).call{value: ETHER_IN_RECEIVER}("");
    }

    function echidna_receiver_balance() public view returns (bool) {
        return address(receiver).balance >= ETHER_IN_RECEIVER;
    }
}
