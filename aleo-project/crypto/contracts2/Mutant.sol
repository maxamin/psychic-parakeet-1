//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interfaces/IMutantOwnable.sol";
import "./interfaces/IMutantMutations.sol";
import "./interfaces/IMutantProxy.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

contract Mutant is IMutantOwnable, IMutantMutations, IMutantProxy {
    IERC721 public immutable _token;
    uint256 public immutable _tokenId;

    mapping(MutationType => Mutation) public _mutationsByTypes;
    mapping(bytes32 => MutationType) public _typesByMutationsIds;

    error NotTokenOwner();
    error ExistingMutation();
    error UnexistingMutation();

    modifier onlyOwner() {
        if (msg.sender != getOwner()) revert NotTokenOwner();
        _;
    }

    constructor(address token, uint256 tokenId) {
        _token = IERC721(token);
        _tokenId = tokenId;
    }

    function delegatecall(address target, bytes calldata data) external onlyOwner override returns (bytes memory) {
        (bool success, bytes memory result) = target.delegatecall(data);
        require(success, string(result));
        return result;
    }

    function call(address target, bytes calldata data) external onlyOwner override returns (bytes memory) {
        (bool success, bytes memory result) = target.call(data);
        require(success, string(result));
        return result;
    }

    function mutate(MutationType mutationType, address token, uint256 tokenId) external onlyOwner override {
        Mutation memory previousMutation = _mutationsByTypes[mutationType];
        Mutation memory newMutation = Mutation(token, tokenId);
        _requireNewMutation(previousMutation, newMutation);

        if (previousMutation.token != address(0x00)) {
            IERC721(previousMutation.token).transferFrom(address(this), getOwner(), previousMutation.tokenId);
        }

        _mutationsByTypes[mutationType] = newMutation;
        _typesByMutationsIds[_mutationId(newMutation)] = mutationType;

        IERC721 mutationToken = IERC721(token);
        mutationToken.transferFrom(mutationToken.ownerOf(tokenId), address(this), tokenId);
        
        emit NewMutation(
            mutationType,
            token,
            tokenId
        );
    }

    function removeMutation(MutationType mutationType, address to) external onlyOwner override {
        Mutation memory previousMutation = _mutationsByTypes[mutationType];
        _requireExistingMutation(previousMutation);

        delete _mutationsByTypes[mutationType];
        delete _typesByMutationsIds[_mutationId(previousMutation)];
        
        emit RemovedMutation(mutationType);

        IERC721(previousMutation.token).transferFrom(address(this), to, previousMutation.tokenId);
    }

    function getMutationURI(MutationType mutationType) external view override returns (string memory) {
        Mutation memory mutation = _mutationsByTypes[mutationType];
        return IERC721Metadata(mutation.token).tokenURI(mutation.tokenId);
    }

    function getMutationsTypes() external pure override returns (MutationType[] memory) {
        MutationType[] memory result = new MutationType[](2);
        result[0] = MutationType.Background;
        result[1] = MutationType.Image;
        return result;
    }

    function getMutation(MutationType mutationType) public view override returns (Mutation memory) {
        return _mutationsByTypes[mutationType];
    }

    function getOwner() public view override returns (address) {
        return _token.ownerOf(_tokenId);
    }

    function _requireNewMutation(Mutation memory a, Mutation memory b) internal pure {
        if (_mutationId(a) == _mutationId(b)) revert ExistingMutation();
    }

    function _requireExistingMutation(Mutation memory m) internal pure {
        if (m.token == address(0x00)) revert UnexistingMutation();
    }

    function _mutationId(Mutation memory m) internal pure returns (bytes32) {
        return keccak256(abi.encode(m));
    }
}
