//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "../structs/MutantStructs.sol";

interface IMutantMutations {
    event NewMutation (
        MutationType indexed mutationType,
        address indexed token,
        uint indexed tokenId
    );

    event RemovedMutation (MutationType indexed mutationType);

    function mutate(MutationType mutationType, address token, uint256 tokenId) external;

    function removeMutation(MutationType mutationType, address to) external;

    function getMutationURI(MutationType mutationType) external view returns (string memory);

    function getMutation(MutationType mutationType) external view returns (Mutation memory);

    function getMutationsTypes() external pure returns (MutationType[] memory);
}
