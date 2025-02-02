// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;
import {Address} from "openzeppelin-contracts/utils/Address.sol";

interface IFlashLoanEtherReceiver {
    function execute() external payable;
}

/**
 * @title SideEntranceLenderPool
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */

contract SideEntranceLenderPool {
    using Address for address payable; // 原来payable address和普通address是两种不同的类型

    mapping(address => uint256) private balances;

    error NotEnoughETHInPool();
    error FlashLoanHasNotBeenPaidBack();

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 amountToWithdraw = balances[msg.sender];
        balances[msg.sender] = 0;
        payable(msg.sender).sendValue(amountToWithdraw);
    }

    function flashLoan(uint256 amount) external {
        uint256 balanceBefore = address(this).balance; // 这个值和sum(balances)不一定相等
        if (balanceBefore < amount) revert NotEnoughETHInPool();

        IFlashLoanEtherReceiver(msg.sender).execute{value: amount}(); // 回调用户的execute函数,顺便把钱打给用户

        // 因为是ETH而不是ERC20代币, 因此不可能通过approve把授权暴露出去
        // 因此肯定是 balanceBefore被修改成了一个不合理的值
        if (address(this).balance < balanceBefore)
            revert FlashLoanHasNotBeenPaidBack();
    }
}