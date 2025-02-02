//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;
// pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IWETH9.sol";


contract SwapExamples {
    // NOTE: Does not work with SwapRouter02
    ISwapRouter public constant swapRouter =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public constant AAVE = 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9;

    /// @notice Swaps a fixed amount of WETH for a maximum possible amount of DAI
    function swapExactInputSingle(address _recipient)
        external
        payable
        returns (uint amountOut)
    {
        IWETH(WETH9).deposit{value: msg.value}();

        IWETH(WETH9).approve(address(swapRouter), msg.value);
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
        .ExactInputSingleParams({
            tokenIn: WETH9,
            tokenOut: USDC,//DAI,
            // pool fee 0.3%
            fee: 3000,
            recipient: _recipient,//msg.sender,
            deadline: block.timestamp + 300, // 5 minutes(300 seconds)
            amountIn: msg.value,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });
        return amountOut = swapRouter.exactInputSingle(params);
    }

    /// @notice swapInputMultiplePools swaps a fixed amount of WETH for a maximum possible amount of DAI
    /// swap WETH --> USDC --> DAI
    function swapExactInputMultihop(
        uint _amountIn,
        address _recipient,
        bytes memory _path,
        address _inputToken
    ) external returns (uint amountOut) {
        // IERC20(USDC).approve(address(this), _amountIn);
        require(IERC20(_inputToken).transferFrom(msg.sender, address(this), _amountIn), "adasda");
        
        require(IERC20(_inputToken).approve(address(swapRouter), _amountIn),"bad2");
        ISwapRouter.ExactInputParams memory params = ISwapRouter
            .ExactInputParams({
                path: _path,
                // abi.encodePacked(
                //     DAI,
                //     uint24(500),
                //     WETH9
                //     // uint24(500),
                //     // USDC,
                //     // uint24(3000),
                //     // AAVE
                // ),
                recipient: _recipient,
                deadline: block.timestamp + 300, // 5 minutes(300 seconds)
                amountIn: _amountIn,
                amountOutMinimum: 0
            });
        amountOut = swapRouter.exactInput(params);
    }



    function testy3() view external returns(uint){
        // return IERC20(DAI).balanceOf(address(this));
        return IERC20(USDC).balanceOf(msg.sender);

        // return IERC20(USDC).allowance(msg.sender, address(this));
        
        // return IWETH(WETH9).balanceOf(address(this));
        // return IWETH(WETH9).balanceOf(msg.sender);
        // return address(this).balance;
    }
receive() payable external {}
}


        // IWETH(WETH9).withdraw(msg.value);

        // TransferHelper.safeTransferFrom(
        //     WETH9,
        //     msg.sender,
        //     address(this),
        //     msg.value
        // );
        // TransferHelper.safeApprove(WETH9, address(swapRouter), msg.value);