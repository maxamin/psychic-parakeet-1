// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CANFund 
{
    event FundCreated(
        uint256 indexed fundId,
        address indexed proprietor,
        string CANname,
        string about,
        uint256 fundNeeded,
        uint256 timeCutOff,
        string poster
    );

    struct CAN 
    {
        address proprietor;
        string CANname;
        string about;
        uint256 fundNeeded;
        uint256 timeCutOff;
        uint256 fundCollected;
        string poster;
        address[] benefactors;
        uint256[] endowments;
    }

    mapping(uint256 => CAN) public funds;
    mapping(address => uint256) public userCANBalance;
    mapping(address => bool) public authenticatedUsers;

    uint256 public totalCANs = 0;

    function authenticateUser(bytes32 message, uint8 v, bytes32 r, bytes32 s) public view returns (bool) 
    {
        address signatory = ecrecover(message, v, r, s);
        return signer == msg.sender;
    }

    function createCAN(address _proprietor, string memory _CANname, string memory _about, uint256 _fundNeeded, uint256 _timeCutOff, string memory _poster) public returns (uint256) 
    {
        CAN storage fund = funds[totalCANs];

        require(fund.timeCutOff < block.timestamp, "Invalid Time Cut Off!");

        fund.proprietor = _proprietor;
        fund.CANname = _CANname;
        fund.about = _about;
        fund.fundNeeded = _fundNeeded;
        fund.timeCutOff = _timeCutOff;
        fund.fundCollected = 0;
        fund.poster = _poster;

        totalCANs++;

        emit FundCreated(totalCANs - 1, _proprietor, _CANname, _about, _fundNeeded, _timeCutOff, _poster);

        return (totalCANs - 1);
    }

    function getCANs() public view returns (CAN[] memory) 
    {
        CAN[] memory totalFunds = new CAN[](numberOfCampaigns);
        uint i = 0;

        for(; i < numberOfCampaigns; i++) 
        {
            CAN storage tempFund = funds[i];
            totalFunds[i] = tempFund;
        }

        return totalFunds;
    }

    function endowCAN(uint256 _id, bytes32 message, uint8 v, bytes32 r, bytes32 s) public payable 
    {
        require(authenticateUser(message, v, r, s), "Invalid signature");

        uint256 fundsEndowing = msg.value;

        CAN storage fund = funds[_id];

        fund.benefactors.push(msg.sender);
        fund.endowments.push(fundsEndowing);

        uint256 canCredit = ((fundsEndowing * 2) / 100);

        userCANBalance[msg.sender] += canCredit;

        (bool sent,) = payable(fund.proprietor).call{value: fundsEndowing}("");

        if(sent) 
        {
            fund.fundCollected = fund.fundCollected + fundsEndowing;
        }
    }

    function getBenefactors(uint256 _id) view public returns (address[] memory, uint256[] memory) 
    {
        return (funds[_id].benefactors, funds[_id].endowments);
    }
}
