// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

/// @dev Wrapped Ether v9 (WETH9) is an Ether (ETH) ERC-20 wrapper. You can `deposit` ETH and obtain a WETH9 balance which can then be operated as an ERC-20 token. You can
/// `withdraw` ETH from WETH9, which will then burn WETH9 token in your wallet. The amount of WETH9 token in any wallet is always identical to the
/// balance of ETH deposited minus the ETH withdrawn with that specific wallet.
interface IWETH {
    function deposit() external payable;

    function withdraw(uint) external;

    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}