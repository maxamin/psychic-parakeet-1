// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract CharityRewards is ERC1155, Ownable {
    address public deployer;
    uint public tokensCount;
    Token[] public tokens;

    struct Token {
        string name;
        string symbol;
        string uri;
    }

    event Added(
        uint tokenId,
        string tokenName,
        string tokenSymbol,
        string tokenUri
    );

    constructor(address _deployer) ERC1155('') {
        deployer = _deployer;
        addToken(
            'Supporting Points',
            'SP',
            'https://bafybeifbqmphvoaymvsqfhta74uyiqylvlsh3icg62bszxqepbainclxlu.ipfs.w3s.link/Supporting-Points.png'
        );
        addToken(
            'Funding Points',
            'FP',
            'https://bafybeie2pa7gtnjetomxbywp4o4zeasrhk3dj653b324ddzufsculkwa7i.ipfs.w3s.link/Funding-Points.png'
        );
    }

    /**
     * @notice Function to check if the token id is valid
     * @param _tokenId subtoken id
     */
    modifier tokenIdConstraints(uint _tokenId) {
        require(_tokenId > 0, "token ID can't be less than zero");
        require(
            _tokenId < tokensCount,
            "token ID can't be more than tokens count"
        );
        _;
    }

    /**
     * @notice Function to check if the tokens ids are valid
     * @param _tokensIds subtokens ids
     */
    modifier tokensIdsConstraints(uint[] memory _tokensIds) {
        for (uint i; i < tokensCount; ++i) {
            require(_tokensIds[i] > 0, "token ID can't be less than zero");
            require(
                _tokensIds[i] < tokensCount,
                "token ID can't be more than tokens count"
            );
        }
        _;
    }

    /** @notice Function to allow admin to add new subtokens of the main ERC1155 token
     * @param _tokenName subtoken name
     * @param _tokenSymbol subtoken symbol
     * @param _tokenUri subtoken uri(metadata location on the ipfs)
     */
    function addToken(
        string memory _tokenName,
        string memory _tokenSymbol,
        string memory _tokenUri
    ) public {
        require(
            msg.sender == deployer || msg.sender == owner(),
            'Only owner-contract or its deployer can add tokens'
        );
        require(bytes(_tokenName).length > 0, 'Token name can not be empty');
        require(
            bytes(_tokenSymbol).length > 0,
            'Token symbol can not be empty'
        );
        require(bytes(_tokenUri).length > 0, 'Token uri can not be empty');

        tokens.push(
            Token({name: _tokenName, symbol: _tokenSymbol, uri: _tokenUri})
        );

        emit Added(
            tokensCount,
            tokens[tokensCount].name,
            tokens[tokensCount].symbol,
            tokens[tokensCount].uri
        );

        tokensCount++;
    }

    /** @notice Function to mint(produce) a subtoken from outside of this contract (externally)
     * @param _to      the doner
     * @param _tokenId subtoken id
     * @param _tokenAmount  number of subtokens to be produced and given to the function caller (_to)
     */
    function mint(
        address _to,
        uint _tokenId,
        uint _tokenAmount
    ) public onlyOwner tokenIdConstraints(_tokenId) {
        _mint(_to, _tokenId, _tokenAmount, '');
    }

    /** @notice Function to mint(produce) subtokens from outside of this contract (externally)
     * @param _to      the doner
     * @param _tokensIds subtokens ids
     * @param _tokensAmounts  number of subtokens to be produced and given to the function caller (_to)
     */
    function mintBatch(
        address _to,
        uint[] memory _tokensIds,
        uint[] memory _tokensAmounts
    ) public onlyOwner tokensIdsConstraints(_tokensIds) {
        _mintBatch(_to, _tokensIds, _tokensAmounts, '');
    }

    /** @notice Function to burn(destroy) subtokens from outside of this contract (externally)
     * @param _from      the doner
     * @param _tokenId subtoken id
     * @param _tokenAmount  number of subtokens to be destroyed
     */
    function burn(
        address _from,
        uint _tokenId,
        uint _tokenAmount
    ) public tokenIdConstraints(_tokenId) {
        require(
            msg.sender == _from || msg.sender == owner(),
            'Only the token holder can burn his tokens or the owner-contract'
        );
        _burn(_from, _tokenId, _tokenAmount);
    }

    /** @notice Function to burn(destroy) subtokens from outside of this contract (externally)
     * @param _from      the doner
     * @param _tokensIds subtokens ids
     * @param _tokensAmounts  number of subtokens to be destroyed
     */
    function burnBatch(
        address _from,
        uint[] memory _tokensIds,
        uint[] memory _tokensAmounts
    ) public tokensIdsConstraints(_tokensIds) {
        require(
            msg.sender == _from || msg.sender == owner(),
            'Only the token holder can burn his tokens or the owner-contract'
        );
        _burnBatch(_from, _tokensIds, _tokensAmounts);
    }

    /** @notice Function to get all subtokens details
     */
    function getTokens() public view returns (Token[] memory) {
        return tokens;
    }

    function getTokensBalances(address _tokensHolder) public view returns (uint[] memory) {
        uint[] memory balances = new uint[](tokensCount);
        for (uint i; i < tokensCount; ++i) {
            balances[i] = balanceOf(_tokensHolder, i);
        }
        return balances;
    }

    // /** @notice Function to get subtoken details
    //  * @param _tokenId subtoken id
    //  */
    // function getToken(
    //     uint _tokenId
    // )
    //     public
    //     view
    //     returns (string memory _name, string memory _symbol, string memory _uri)
    // {
    //     return (
    //         tokens[_tokenId].name,
    //         tokens[_tokenId].symbol,
    //         tokens[_tokenId].uri
    //     );
    // }

    // /** @notice overriden function to prevent all non-owner token holders from minting, transfering, and burning their tokens AKA (soulbound tokens)
    //   */
    // function _beforeTokenTransfer(
    //     address operator,
    //     address from,
    //     address to,
    //     uint[] memory ids,
    //     uint[] memory amounts,
    //     bytes memory data
    // ) internal view override onlyOwner{}

    // function dummy2(address a) pure  public returns (address){
    //     return a;
    // }
}
