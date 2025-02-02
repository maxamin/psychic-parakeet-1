// SPDX-License-Identifier: MIT
pragma solidity 0.8.23; // This is solidity version

contract SimpleStorage {
    uint256 myFavoriteNumber;
    
    //Array uint256[] xYz;
    struct Person{
        uint256 favoriteNumber;
        string name;
    }
    //dynamic array: can have any size, e.g, Person[] public thisIsDynamicArray;
    //static array: can have only a definite size/given size, e.g, Person[3] public thisIsStaticArray;

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