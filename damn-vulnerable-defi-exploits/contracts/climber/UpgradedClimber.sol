// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UpgradedClimber is OwnableUpgradeable, UUPSUpgradeable {
    constructor() {}

    function sweepFunds(address tokenAddress) external {
        IERC20 token = IERC20(tokenAddress);
        require(
            token.transfer(tx.origin, token.balanceOf(address(this))),
            "Transfer failed"
        );
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}
