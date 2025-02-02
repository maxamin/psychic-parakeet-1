// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import {Address} from "openzeppelin-contracts/utils/Address.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/security/ReentrancyGuard.sol";

import {TrustfulOracle} from "./TrustfulOracle.sol";
import {DamnValuableNFT} from "../DamnValuableNFT.sol";

/**
 * @title Exchange
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */
contract Exchange is ReentrancyGuard {
    using Address for address payable;

    DamnValuableNFT public immutable token;
    TrustfulOracle public immutable oracle;

    event TokenBought(address indexed buyer, uint256 tokenId, uint256 price);
    event TokenSold(address indexed seller, uint256 tokenId, uint256 price);

    error NotEnoughETHInBalance();
    error AmountPaidIsNotEnough();
    error ValueMustBeGreaterThanZero();
    error SellerMustBeTheOwner();
    error SellerMustHaveApprovedTransfer();

    constructor(address oracleAddress) payable {
        token = new DamnValuableNFT();
        oracle = TrustfulOracle(oracleAddress);
    }

    // 根据预言机报价的中位价格进行购买(mint)
    // 并退回多余的钱
    function buyOne() external payable nonReentrant returns (uint256) {
        uint256 amountPaidInWei = msg.value;
        if (amountPaidInWei == 0) revert ValueMustBeGreaterThanZero();

        // Price should be in [wei / NFT]
        uint256 currentPriceInWei = oracle.getMedianPrice(token.symbol());
        if (amountPaidInWei < currentPriceInWei) revert AmountPaidIsNotEnough();

        uint256 tokenId = token.safeMint(msg.sender);

        payable(msg.sender).sendValue(amountPaidInWei - currentPriceInWei);

        emit TokenBought(msg.sender, tokenId, currentPriceInWei);

        return tokenId;
    }

    // 通过预言机报价获得NFT的价格,然后卖给本合约,本合约直接打钱给用户,并销毁到手的NFT
    // 本次exploit必然是扭曲预言机价格然后把合约卖给Exchange交易所
    function sellOne(uint256 tokenId) external nonReentrant {
        if (msg.sender != token.ownerOf(tokenId)) revert SellerMustBeTheOwner();
        if (token.getApproved(tokenId) != address(this))
            revert SellerMustHaveApprovedTransfer();

        // Price should be in [wei / NFT]
        uint256 currentPriceInWei = oracle.getMedianPrice(token.symbol());
        if (address(this).balance < currentPriceInWei)
            revert NotEnoughETHInBalance();

        token.transferFrom(msg.sender, address(this), tokenId);
        token.burn(tokenId);

        payable(msg.sender).sendValue(currentPriceInWei);

        emit TokenSold(msg.sender, tokenId, currentPriceInWei);
    }

    receive() external payable {}
}
