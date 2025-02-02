// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23; // This is solidity version

contract SimpleStorage {
    uint256 myFavoriteNumber;
    
    //Mapping : It's like a dictionary (Set of key and values.)
    struct Person{
        uint256 favoriteNumber;
        string name;
    }

    Person[] public listOfPeople; //this is an empty list []
    mapping (string=>uint256) public nameToFavoriteNumber;

    function store(uint _favoriteNumber) public {
        myFavoriteNumber = _favoriteNumber;
    }
    // view and pure keywords
    function retrive() public view returns(uint256) {
        return myFavoriteNumber;
    }

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        listOfPeople.push(Person(_favoriteNumber, _name));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
}

contract StorageFactory{

    //uint256 public favoriteNumber
    //type visibility name
    SimpleStorage public simpleStorage;

    function createSimpleStorageContract() public {
        simpleStorage = new SimpleStorage();        
    }
}