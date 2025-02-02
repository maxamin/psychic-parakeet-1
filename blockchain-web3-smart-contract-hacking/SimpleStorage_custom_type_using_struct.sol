// SPDX-License-Identifier: MIT
pragma solidity 0.8.23; // This is solidity version

contract SimpleStorage {
    uint256 public myFavoriteNumber;
    
    //creating custom type using 'struct'
    struct Person{
        uint256 favoriteNumber;
        string name;
    }
    Person public myFriend = Person(7,"Pat"); // This is one way to write. Also we have to put custom type twice in a sentence, when working with.
    //second way: Person public pat = Person(7,"Pat");
    //Third way:  Person public pat = Person({favoriteNumber: 7, name: "Pat"});

    function store(uint _favoriteNumber) public {
        myFavoriteNumber = _favoriteNumber;
    }
    // view and pure keywords
    function retrive() public view returns(uint256) {
        return myFavoriteNumber;
    }
}