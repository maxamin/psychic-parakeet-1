// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Address.sol";

interface IFlashLoanEtherReceiver {
    function execute() external payable; // use this function to insert deposit
}

/**
 * @title SideEntranceLenderPool
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */

contract SideEntranceLenderPool {
    using Address for address payable;

    mapping (address => uint256) private balances;

    // Update the balance of the person who diposit
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }


    function withdraw() external {
        // require(balances[msg.sender] > 0, "not enough funds");
        uint256 amountToWithdraw = balances[msg.sender];
        balances[msg.sender] = 0;
        payable(msg.sender).sendValue(amountToWithdraw);
    }


    function flashLoan(uint256 amount) external {
        uint256 balanceBefore = address(this).balance;
        
        require(balanceBefore >= amount, "Not enough ETH in balance");
        
        IFlashLoanEtherReceiver(msg.sender).execute{value: amount}();

        require(address(this).balance >= balanceBefore, "Flash loan hasn't been paid back");        
    }
}
 