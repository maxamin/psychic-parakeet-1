// SPDX-License-Identifier: MIT
pragma solidity 0.8.23; // This is solidity version

contract SimpleStorage {
    uint256 myFavoriteNumber;
    
    //Memory, Storage and Calldata
    struct Person{
        uint256 favoriteNumber;
        string name;
    }
    //EVM can access and store information in six places.
    //1. Stack, 2. Memory, 3. Memory, 4. Storage, 5. Calldata and 6. Logs
    // Calldata and Memory means temporary variables.

    Person[] public listOfPeople; //this is an empty list []


    function store(uint _favoriteNumber) public {
        myFavoriteNumber = _favoriteNumber;
    }
    // view and pure keywords
    function retrive() public view returns(uint256) {
        return myFavoriteNumber;
    }

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        listOfPeople.push(Person(_favoriteNumber, _name));
    }
}