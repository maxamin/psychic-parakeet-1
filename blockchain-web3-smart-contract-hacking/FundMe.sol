//Withdraw funds
//Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
//constant keyword and immutable keyword
pragma solidity ^0.8.23;

import {PriceConverter} from "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant minimumUsd = 5e18; // constant keyword reduces gas price

    address[] public funders;
    mapping (address funder => uint256 amountFunded) public addressToAmountFunded; 
    address public immutable i_owner; //immutable keyword reduces gas price

    constructor() {
        i_owner = msg.sender;
    }

    function fund() public payable {
        //msg.value.getConversionRate();
        require(msg.value.getConversionRate() >= minimumUsd, "didn't send enough ETH"); //1e18 = 1 ETH = 1*10**18 wei
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = addressToAmountFunded[msg.sender] + msg.value;
    }

    function withdraw() public onlyOwner {
        for(uint256 funderIndex = 0; funderIndex < funders.length ; funderIndex++) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);

        //transfer
        //payable(msg.sender).transfer(address(this).balance);
        //send
        //bool sendSuccess = payable(msg.sender).send(address(this).balance);
        //require (sendSuccess, "Send failed");
        //call
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
        //msg.sender = address
        //payable(msg.sender) = payable == we're doing 'typcasting' here. 
    }

    modifier onlyOwner() {
        require(msg.sender == i_owner, "Sender is not owner");
        _;
    }
}