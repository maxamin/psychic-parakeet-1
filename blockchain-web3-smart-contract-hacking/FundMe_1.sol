// Get funds from users
//Withdraw funds
//Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract FundMe {
    uint256 public myValue = 1;

    function fund() public payable {
        //Allow users to send $
        //Have a minimum $ sent
        // 1. How do we send ETH to this contract?
        //What is revert?
        //Undo any actions that have been done, and send the remaining gas back.
        myValue = myValue+2;
        require(msg.value > 1e18, "didn't send enough ETH"); //1e18 = 1 ETH = 1*10**18 wei

        
    }

    //function withdraw() public {}
}