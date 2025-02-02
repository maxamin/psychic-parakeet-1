// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// Factory contract
contract CampaignFactory {
    //// Campaign Factory contract is a contract that deploys Campaign contracts to each user's interaction (this way the gas payment is on the user)
    Campaign[] public deployedCampaigns;

    //// Function to create new Campaigns
    function createCampaign(uint256 minimum) public {
        Campaign newCampaign = new Campaign(minimum, payable(msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    //// Function to see the list of all deployed Campaigns
    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

// Campaign contract
contract Campaign {
    //// Request struct
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address payable public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    //// Global Modifier to diminush the code
    modifier restricted() {
        require(payable(msg.sender) == manager);
        _; //// modified code will be "pasted" here
    }

    //// Constructor function that sets minimumContribution and owner
    constructor(uint256 minimum, address payable creator) payable {
        manager = creator; //// manager variable
        minimumContribution = minimum; //// minimum contribution variable
    }

    //// Called when someone donates to the campaign and becomes an approver
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[payable(msg.sender)] = true;
        approversCount++;
    }

    //// Called by the manager to create a new "spending request"
    function createRequest(
        string calldata description,
        uint256 value,
        address payable recipient
    ) public restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description; //// manager describes request
        newRequest.value = value; //// manager describes amount of money needed to send for a vendor
        newRequest.recipient = recipient; //// manager describes address money will be sent to
        newRequest.complete = false; //// true after tbe request is executed
        newRequest.approvalCount = 0; //// DAO
    }

    //// Called by each contributor to approve a spending request
    function approveRequest(uint256 index) public {
        Request storage request = requests[index]; //// Storage and Memory sometimes refers to where the contract stores data and sometimes refers to how the Solidity variables store values. The documentations just talk about the first one though.
        //// Storage holds data between function calls (similar to an HD)
        //// Memory is a place to temporary store data (similar to RAM)
        //// if i didn't use storage in this function, i would get an error. This is because it refers to how solidity variables store values. The keyword storage changes how myArray variable works by poiting exactly where the numbers variable is pointing at. If i used memory it would make a copy of this pointed variable that would be temporary.

        /* Memory Example
function Numbers() public {
    numbers.push(20);
    numbers.push(32);

    changeArray(numbers);

    function changeArray(int[] myArray) private {
        myArray[0] = 1;
    }
}
        If we deploy the contract and retrieve the first number of the array it will be 20 and not 1, because memory made a copy of the array, it did not change the original one.
        if i change the value to storage the retrieved number would be 1 instead.*/

        require(approvers[payable(msg.sender)]); //// make sure has donated
        require(!request.approvals[payable(msg.sender)]); //// make sure it has not already voted
        request.approvals[payable(msg.sender)] = true; //// add address to approvals mapping
        request.approvalCount++; //// increment count

        /* The poor way of implementing this same function would be with arrays and the foor loop (costs more gas and might cap the users)

  function approveRequest(Request request) public {
        //// Make sure person calling this function has donated
        bool isApprover = false;
        for (uint i = 0; i <approvers.lenght;i++) {
            if (approvers[i]) == msg.sender {
                isApprover = true;
            }
        }
        require(isApprover);
        //// Make sure person calling this function hasn't voted before
        for (uint i=0; i < request.approvers.lenght; i++) {
require(request.approvers[i] != msg.sender)
        }
    }

        */
    }

    // After a request has gotten enough approvals, the manager can call this to get money sent to the vendor
    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];
        require(requests[index].approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return (requests.length);
    }
}
