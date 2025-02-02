//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IMutantProxy {
    function delegatecall(address target, bytes calldata data) external returns (bytes memory);

    function call(address target, bytes calldata data) external returns (bytes memory);
}
