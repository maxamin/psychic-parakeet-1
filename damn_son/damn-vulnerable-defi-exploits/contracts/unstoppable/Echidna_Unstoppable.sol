//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./DamnValuableToken.sol";
import "./UnstoppableLender.sol";

contract Echidna_Unstoppable is IReceiver {
    address echidna_caller = msg.sender;
    uint256 constant TOKENS_IN_POOL = 1000000 ether;
    uint256 constant ATTACKER_TOKENS = 100 ether;

    DamnValuableToken token;
    UnstoppableLender pool;

    constructor() payable {
        token = new DamnValuableToken();
        pool = new UnstoppableLender(address(token));

        token.approve(address(pool), TOKENS_IN_POOL);
        pool.depositTokens(TOKENS_IN_POOL);
        token.transfer(echidna_caller, ATTACKER_TOKENS);
    }

    function receiveTokens(address _token, uint256 _amount) external override {
        require(msg.sender == address(pool), "Sender must be pool");
        require(
            IERC20(_token).transfer(msg.sender, _amount),
            "Token transfer failed"
        );
    }

    function echidna_unstoppable_pool() public returns (bool) {
        pool.flashLoan(1 ether);
        return true;
    }
}
