// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import {DamnValuableTokenSnapshot} from "../DamnValuableTokenSnapshot.sol";
import {Address} from "openzeppelin-contracts/utils/Address.sol";

/**
 * @title SimpleGovernance
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */

contract SimpleGovernance {
    using Address for address;

    struct GovernanceAction {
        address receiver;
        bytes data;
        uint256 weiAmount;
        uint256 proposedAt;
        uint256 executedAt;
    }

    DamnValuableTokenSnapshot public governanceToken;

    mapping(uint256 => GovernanceAction) public actions;
    uint256 private actionCounter;
    uint256 private constant ACTION_DELAY_IN_SECONDS = 2 days;

    event ActionQueued(uint256 actionId, address indexed caller);
    event ActionExecuted(uint256 actionId, address indexed caller);

    error GovernanceTokenCannotBeZeroAddress();
    error NotEnoughVotesToPropose();
    error CannotQueueActionsThatAffectGovernance();
    error CannotExecuteThisAction();

    constructor(address governanceTokenAddress) {
        if (governanceTokenAddress == address(0))
            revert GovernanceTokenCannotBeZeroAddress();

        // 这是个类型转换, 但address变量的名字暗示了DamnValuableTokenSnapshot这个代币具有治理功能
        governanceToken = DamnValuableTokenSnapshot(governanceTokenAddress);
        actionCounter = 1;
    }

    // 只要满足一定的条件,就拥有投票权, 拥有投票权就能够把自己想要的执行的操作纳入actions中
    // 调用queueAction的时候只要满足该条件,提案就能成功进入队列
    function queueAction(
        address receiver,
        bytes calldata data,
        uint256 weiAmount
    ) external returns (uint256) {
        if (!_hasEnoughVotes(msg.sender)) revert NotEnoughVotesToPropose();
        if (receiver == address(this))
            revert CannotQueueActionsThatAffectGovernance();

        uint256 actionId = actionCounter;

        GovernanceAction storage actionToQueue = actions[actionId];
        actionToQueue.receiver = receiver;
        actionToQueue.weiAmount = weiAmount;
        actionToQueue.data = data;
        actionToQueue.proposedAt = block.timestamp;

        actionCounter++;

        emit ActionQueued(actionId, msg.sender);
        return actionId;
    }

    function executeAction(uint256 actionId) external payable {
        if (!_canBeExecuted(actionId)) revert CannotExecuteThisAction();

        GovernanceAction storage actionToExecute = actions[actionId];
        actionToExecute.executedAt = block.timestamp;

        // 这个所谓的action其实就是带着Ether调用目标的某个函数
        // 转走的不知道是谁的Ether
        actionToExecute.receiver.functionCallWithValue (
            actionToExecute.data,
            actionToExecute.weiAmount
        );

        emit ActionExecuted(actionId, msg.sender);
    }

    function getActionDelay() public pure returns (uint256) {
        return ACTION_DELAY_IN_SECONDS;
    }

    /**
     * @dev an action can only be executed if:
     * 1) it's never been executed before and
     * 2) enough time has passed since it was first proposed
     */
    function _canBeExecuted(uint256 actionId) private view returns (bool) {
        GovernanceAction memory actionToExecute = actions[actionId];
        return (actionToExecute.executedAt == 0 &&
            (block.timestamp - actionToExecute.proposedAt >=
                ACTION_DELAY_IN_SECONDS));
    }

    function _hasEnoughVotes(address account) private view returns (bool) {
        // account在上次dvt进行快照时的余额
        uint256 balance = governanceToken.getBalanceAtLastSnapshot(account); 

        // 要求account在上次快照时拥有半数以上的币数才返回true
        uint256 halfTotalSupply = governanceToken
            .getTotalSupplyAtLastSnapshot() / 2;
        return balance > halfTotalSupply;
    }
}
