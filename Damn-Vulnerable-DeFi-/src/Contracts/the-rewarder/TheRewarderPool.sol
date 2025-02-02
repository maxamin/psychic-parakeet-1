// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import {RewardToken} from "./RewardToken.sol";
import {DamnValuableToken} from "../DamnValuableToken.sol";
import {AccountingToken} from "./AccountingToken.sol";

/**
 * @title TheRewarderPool
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */

contract TheRewarderPool {
    // Minimum duration of each round of rewards in seconds
    uint256 private constant REWARDS_ROUND_MIN_DURATION = 5 days;

    uint256 public lastSnapshotIdForRewards;
    uint256 public lastRecordedSnapshotTimestamp;

    mapping(address => uint256) public lastRewardTimestamps;
    // 当某个地址获取rewards时更新获取rewards时的时间

    // Token deposited into the pool by users
    DamnValuableToken public immutable liquidityToken;

    // Token used for internal accounting and snapshots
    // Pegged 1:1 with the liquidity token
    AccountingToken public accToken;

    // Token in which rewards are issued
    RewardToken public immutable rewardToken;

    // Track number of rounds
    uint256 public roundNumber;

    error MustDepositTokens();
    error TransferFail();

    constructor(address tokenAddress) {
        // Assuming all three tokens have 18 decimals
        liquidityToken = DamnValuableToken(tokenAddress);
        accToken = new AccountingToken();
        rewardToken = new RewardToken();

        _recordSnapshot();
        // 对用来计数的accToken进行snapshot,更新存储在本合约中的snapshotID,执行snapshot时的时间戳,以及自增轮次
    }

    /**
     * @notice sender must have approved `amountToDeposit` liquidity tokens in advance
     */
    
    function deposit(uint256 amountToDeposit) external {
        if (amountToDeposit == 0) revert MustDepositTokens();

        accToken.mint(msg.sender, amountToDeposit);
        // 每次存款的时候通过mint更新accToken的值

        distributeRewards();

        if (
            !liquidityToken.transferFrom(
                msg.sender,
                address(this),
                amountToDeposit
            )
        ) revert TransferFail();
    }

    // 取款的时候好像没检查取款额度是否合法,但其实是不需要检查的
    // 因为用户拥有的accToken的数量严格等于用户存进来的liquidityToken数量
    // 如果用户试图取走不合理的钱会导致burn accToken的动作失败
    function withdraw(uint256 amountToWithdraw) external {
        accToken.burn(msg.sender, amountToWithdraw);
        if (!liquidityToken.transfer(msg.sender, amountToWithdraw))
            revert TransferFail();
    }

    function distributeRewards() public returns (uint256) {
        uint256 rewards = 0;

        if (isNewRewardsRound()) { // 如果新一轮的分钱开始了
            _recordSnapshot(); // 就进行快照,并更新snapshotID,并更新最后记录的时间戳
            // 也就是说想要领rToken,只需要保证快照的时候账户里有accToken, 也就是必须有dvt
            // 然后在一个分红周期内把钱领了就好
            // 那么如果在快照的时候用户在池子里并没有dvt存款,而是在一个分红周期中存入了dvt,这是没用的
            // 本分红周期仍然拿不到分红,因为rToken的mint只和快照中的accToken数量有关
        }
        // 如果仍然处在一个正在进行中的分钱轮次,则不进行快照

        // 获得accToken在lastSnapshotIdForRewards这个snapshotID处的总供应量
        uint256 totalDeposits = accToken.totalSupplyAt(
            lastSnapshotIdForRewards
        );

        // 获得msg.sender在lastSnapshotIdForRewards这个snapshotID处拥有的accToken数量
        uint256 amountDeposited = accToken.balanceOfAt(
            msg.sender,
            lastSnapshotIdForRewards
        );
        

        if (amountDeposited > 0 && totalDeposits > 0) {
            rewards = (amountDeposited * 100 ether) / totalDeposits;
            // 根据快照时间点msg.sender拥有的token数量以及那个时间点token的总供应量计算应得的分红token的数量

            if (rewards > 0 && !_hasRetrievedReward(msg.sender)) {
                rewardToken.mint(msg.sender, rewards); // 通过mint的方式发放奖励
                lastRewardTimestamps[msg.sender] = block.timestamp;
                // 记录msg.sender获得奖励的最后区块时间
                // 该值和lastRecordedSnapshotTimestamp不同的原因只能是某次分红时msg.sender没领
            }
        }

        return rewards;
    }

    // 只有到了新一轮分红的时间,该函数才会被调用
    // 也只有该函数被调用的时候,lastSnapshotIdForRewards和lastRecordedSnapshotTimestamp才会被更新
    function _recordSnapshot() private {
        lastSnapshotIdForRewards = accToken.snapshot();
        lastRecordedSnapshotTimestamp = block.timestamp;
        roundNumber++;
    }
    
    // 这两个条件不能同时成立,同时成立表示用户想不当得利,即在某个分红周期内分了还想分
    // 这个lastRecordedSnapshotTimestamp变量记录的是最近一次分红周期的开启时间
    function _hasRetrievedReward(address account) private view returns (bool) {
        return (
            lastRewardTimestamps[account] >=lastRecordedSnapshotTimestamp &&
            lastRewardTimestamps[account] <=lastRecordedSnapshotTimestamp + REWARDS_ROUND_MIN_DURATION);
    }
    // 画时间线段图可知如果上面两个条件同时成立,只意味着一件事,那就是该账户已经参与过了本轮次的分红

    function isNewRewardsRound() public view returns (bool) {
        return
            block.timestamp >=
            lastRecordedSnapshotTimestamp + REWARDS_ROUND_MIN_DURATION;
    }
}
