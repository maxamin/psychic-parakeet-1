// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Address.sol";

interface IFlashLoanEtherReceiver {
    function execute() external payable;
}

/**
 * @title SideEntranceLenderPool
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */
contract SideEntranceLenderPool {
    using Address for address payable;

    mapping(address => uint256) private balances;

    /**
     *
     * 凸 ( ͡◣ ͜ʖ ͡◢)凸
     * VULNERABILITY: Can be called in receiver's execute function
     * to deposit the loan amount back into pool
     */
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    /**
     *
     * (╯ ͡ಠ ͜ʖ ͡ಠ)╯┻━┻
     * AFFECTED
     */
    function withdraw() external {
        uint256 amountToWithdraw = balances[msg.sender];
        balances[msg.sender] = 0;
        payable(msg.sender).sendValue(amountToWithdraw);
    }

    function flashLoan(uint256 amount) external {
        uint256 balanceBefore = address(this).balance;
        require(balanceBefore >= amount, "Not enough ETH in balance");

        /**
         *
         * 凸 ( ͡◣ ͜ʖ ͡◢)凸
         * VULNERABILITY: External contract function called
         */
        IFlashLoanEtherReceiver(msg.sender).execute{value: amount}();

        require(
            address(this).balance >= balanceBefore,
            "Flash loan hasn't been paid back"
        );
    }
}
