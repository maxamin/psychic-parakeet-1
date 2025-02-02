//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

enum MutationType {
    Background,
    Image
}

struct Mutation {
    address token;
    uint tokenId;
}
