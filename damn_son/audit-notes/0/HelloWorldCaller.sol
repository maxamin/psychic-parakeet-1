// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./HelloWorld.sol";

contract HelloWorldCaller{
    HelloWorld helloWorld;

    constructor(address _addr){
        helloWorld = HelloWorld(_addr);
    }

    function helloCaller() public returns (string memory){
        (bool success, bytes memory result) = address(helloWorld).delegatecall(abi.encodeWithSignature("hello()"));
        return success ? abi.decode(result, (string)) : "Ohno";
    }

    function helloCallerNotAllowed() public returns (string memory){
        (bool success, bytes memory result) = address(helloWorld).call(abi.encodeWithSignature("hello()"));
        return success ? abi.decode(result, (string)) : "Ohno";
    }
}