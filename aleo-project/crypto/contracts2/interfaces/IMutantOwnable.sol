//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IMutantOwnable {
    function getOwner() external view returns (address);
}
