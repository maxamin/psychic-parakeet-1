// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title NaiveReceiverLenderPool
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */
contract NaiveReceiverLenderPool is ReentrancyGuard {

    using Address for address;

    // THE FEE TO PAY WHEN ASKING FOR A FLASH LOAN
    uint256 private constant FIXED_FEE = 1 ether; // not the cheapest flash loan ^_^

    // RETURN THE THE FIXED_FEE
    function fixedFee() external pure returns (uint256) {
        return FIXED_FEE;
    }

    //@dev BORROWER is going to be the contract the victim
    //@dev BORROWAMOUNT 0
    // @audit there no np check require if only the owner of the smart contract can call this function
    // which make it vulnerables
    function flashLoan(address borrower, uint256 borrowAmount) external nonReentrant {

        // THE BALANCE BEFORE THE BORROWER ASK FOR A LOAN
        uint256 balanceBefore = address(this).balance;

        // CHECKING IF THE POOL HAS ENOUG TOKEN TO BORROW
        require(balanceBefore >= borrowAmount, "Not enough ETH in pool");

        require(borrower.isContract(), "Borrower must be a deployed contract");

        // Transfer ETH and handle control to receiver
        borrower.functionCallWithValue(
            abi.encodeWithSignature(
                "receiveEther(uint256)",
                FIXED_FEE
            ),
            borrowAmount
        );
        
        require(
            address(this).balance >= balanceBefore + FIXED_FEE,
            "Flash loan hasn't been paid back"
        );
    }

    // Allow deposits of ETH
    receive () external payable {}
}
