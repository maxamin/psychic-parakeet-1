// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import './CharityRewards.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './interfaces/IWETH9.sol';

/// @title Crowdfunding on blockchain
/// @author Mohab M. Gamal
/// @notice A smart contract for crowdfunding campaigns
/// @dev All function calls are currently implemented without side effects
contract CrowdCharity {
    CharityRewards public rewardContract = new CharityRewards(msg.sender);
    ISwapRouter public constant SWAPROUTER =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;

    struct Campaign {
        address owner;
        uint target;
        uint raisedAmount;
        uint withdrawnAmount;
        uint timeStamp;
        uint rewardTokenId;
        uint softcap;
        bool isOpen;
        string image;
        string title;
    }
    //campaignID => (Funder => amount)
    mapping(uint => mapping(address => uint)) public fundersContributions;
    Campaign[] public campaigns;
    uint public campaignsCount;

    event Started(
        address indexed campaignOwner,
        uint indexed campaignId,
        uint indexed rewardTokenId,
        uint campaignTimestamp,
        uint campaignTarget
    );

    event Funded(
        uint indexed campaignId,
        uint fundedAmount,
        uint indexed timestamp,
        address indexed funder,
        address campaignOwner
    );

    event Closed(
        uint indexed campaignId,
        address indexed campaignOwner,
        uint indexed timestamp
    );

    event Withdrawn(
        uint indexed campaignId,
        address indexed campaignOwner,
        uint indexed timestamp,
        uint amount
    );

    event Refunded(
        uint indexed campaignId,
        address indexed campaignOwner,
        uint indexed timestamp,
        uint amount
    );

    /**
     * @notice Modifier to check if the campaign is open and greater than or equal zero.
     * @param _campaignId The id of the campaign to be funded.
     */
    modifier campaignIdConstraints(uint _campaignId) {
        require(_campaignId < campaignsCount, 'Campaign ID is out of range');
        require(_campaignId >= 0, 'Campaign ID is less than zero');
        _;
    }

    /**
     * @notice Modifier to check if the _fundAmount > 0, the campaign is open and not owned by the funder.
     * @param _campaignId The id of the campaign to be funded.
     * @param _fundAmount The amount of DAI to be funded.
     */
    modifier fundingConstraints(uint _campaignId, uint _fundAmount) {
        require(
            campaigns[_campaignId].isOpen == true,
            'Sadly the campaign is closed by its owner'
        );
        require(
            campaigns[_campaignId].owner != msg.sender,
            "Campaign owner can't fund their own campaign"
        );
        require(_fundAmount > 0, 'Very small funding amount');
        _;
    }

    /**
     * @notice function to mint rewards, emit Funded event, and update the campaign raised amount.
     * @param _campaignId The id of the campaign to be funded.
     * @param _fundedAmountInDai The amount of DAI to be funded.
     */
    function _finalizeFunding(
        uint _campaignId,
        uint _fundedAmountInDai
    ) internal {
        campaigns[_campaignId].raisedAmount += _fundedAmountInDai;
        fundersContributions[_campaignId][msg.sender] += _fundedAmountInDai;

        rewardContract.mint(
            msg.sender,
            campaigns[_campaignId].rewardTokenId,
            _fundedAmountInDai
        );

        emit Funded(
            _campaignId,
            _fundedAmountInDai,
            block.timestamp,
            msg.sender,
            campaigns[_campaignId].owner
        );
    }

    /// @notice Swaps a fixed amount of WETH for a maximum possible amount of DAI through Uniswap V3
    /// @dev though uses msg.value it is not a payable function. Hence, Must be called from a payable function
    /// @return _OutputAmount the equivilant DAI of msg.value
    function _swapEthtoDai() internal returns (uint _OutputAmount) {
        // convert eth to weth to be traded as a normal ERC20 token
        IWETH(WETH9).deposit{value: msg.value}();
        // approve Uniswap router to spend this contract weth
        require(
            IWETH(WETH9).approve(address(SWAPROUTER), msg.value),
            'WETH transfer approval failed'
        );
        // setting up the params for the swap
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WETH9,
                tokenOut: DAI,
                fee: 3000, // pool fee 0.3%
                recipient: address(this),
                deadline: block.timestamp + 300, // 5 minutes(300 seconds)
                amountIn: msg.value,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        // swaping Weth to DAI function
        return SWAPROUTER.exactInputSingle(params);
    }

    /// @notice Swaps a fixed amount of any token for a maximum possible amount of DAI through Uniswap V3
    /// @param _inputAmount The amount of the token that user need to donate with
    /// @param _path abi encoded swap path of the token that requsted to be converted to DAI. Datatype is bytes
    /// @param _inputToken the token that user need to donate with
    /// @return _OutputAmount the equivilant DAI of msg.value
    function _swapTokentoDai(
        uint _inputAmount,
        bytes memory _path,
        address _inputToken
    ) internal returns (uint _OutputAmount) {
        // transfer input Token to this contract
        require(
            IERC20(_inputToken).transferFrom(
                msg.sender,
                address(this),
                _inputAmount
            ),
            'Your tokens transfer to this contract failed'
        );
        // approve Uniswap router to spend this contract input Token balance
        require(
            IERC20(_inputToken).approve(address(SWAPROUTER), _inputAmount),
            "Couldn't approve Uniswap router to spend this contract tokens"
        );

        ISwapRouter.ExactInputParams memory params = ISwapRouter
            .ExactInputParams({
                path: _path,
                recipient: address(this),
                deadline: block.timestamp + 300, // 5 minutes(300 seconds)
                amountIn: _inputAmount,
                amountOutMinimum: 0
            });
        return SWAPROUTER.exactInput(params);
    }

    /// @notice funding campaigns in the native currency (ETH)
    /// @dev It converts Eth to Weth under the hood
    /// @param _campaignId defines the index of targeted campaign
    function fundInEth(
        uint _campaignId
    )
        external
        payable
        fundingConstraints(_campaignId, msg.value)
        campaignIdConstraints(_campaignId)
    {
        uint _fundedAmountInDai = _swapEthtoDai();
        _finalizeFunding(_campaignId, _fundedAmountInDai);
    }

    /// @notice Funding campaigns with DAI token
    /// @param _campaignId The index of the targeted campaign
    /// @param _inputAmount The amount of DAI to be donated
    function fundInDAI(
        uint _campaignId,
        uint _inputAmount
    )
        external
        fundingConstraints(_campaignId, _inputAmount)
        campaignIdConstraints(_campaignId)
    {
        require(
            IERC20(DAI).transferFrom(msg.sender, address(this), _inputAmount),
            'Your tokens transfer to campaign owner failed'
        );
        _finalizeFunding(_campaignId, _inputAmount);
    }

    /// @notice Funding campaigns with any token
    /// @param _campaignId The index of the targeted campaign
    /// @param _inputAmount The amount of the token to be donated
    /// @param _path The ABI encoded swap path of the token to be converted to DAI
    /// @param _inputToken The address of the token to be donated
    function fundInToken(
        uint _campaignId,
        uint _inputAmount,
        bytes memory _path,
        address _inputToken
    )
        external
        fundingConstraints(_campaignId, _inputAmount)
        campaignIdConstraints(_campaignId)
    {
        require(
            _inputToken != address(0) && _inputToken != DAI,
            'Token address cannot be 0 and DAI cannot be used for this function'
        );
        uint _fundedAmountInDai = _swapTokentoDai(
            _inputAmount,
            _path,
            _inputToken
        );
        _finalizeFunding(_campaignId, _fundedAmountInDai);
    }

    /** @notice Function to withdraw funds from a campaign.
     * @param _campaignId defines the index of targeted campaign
     */
    function withdrawFunds(
        uint _campaignId
    ) public campaignIdConstraints(_campaignId) {
        require(
            campaigns[_campaignId].owner == msg.sender,
            'Only owner can withdraw funds'
        );
        require(
            campaigns[_campaignId].softcap <=
                campaigns[_campaignId].raisedAmount,
            "Softcap not reached yet, you can't withdraw"
        );

        uint _withdrawAmount = campaigns[_campaignId].raisedAmount -
            campaigns[_campaignId].withdrawnAmount;
        require(_withdrawAmount > 0, 'No funds to withdraw');
        require(
            IERC20(DAI).transferFrom(
                address(this),
                msg.sender,
                _withdrawAmount
            ),
            'Withdraw failed'
        );
        campaigns[_campaignId].withdrawnAmount += _withdrawAmount;

        emit Withdrawn(
            _campaignId,
            campaigns[_campaignId].owner,
            _withdrawAmount,
            block.timestamp
        );
    }

    /** @notice Function to refund funds from a campaign.
     * @param _campaignId defines the index of targeted campaign
     */
    function refund(
        uint _campaignId
    ) public campaignIdConstraints(_campaignId) {
        uint _tokenBalance = rewardContract.balanceOf(
            msg.sender,
            campaigns[_campaignId].rewardTokenId
        );
        uint _refundAmount = fundersContributions[_campaignId][msg.sender];

        require(_refundAmount > 0, "You don't have any funds to be refunded");
        require(
            _tokenBalance >= _refundAmount,
            "You don't have enough tokens to refunded"
        );
        require(
            campaigns[_campaignId].softcap >
                campaigns[_campaignId].raisedAmount,
            "Softcap reached, you can't refund"
        );

        require(
            IERC20(DAI).transferFrom(address(this), msg.sender, _refundAmount),
            'Refund failed'
        );
        fundersContributions[_campaignId][msg.sender] = 0;
        campaigns[_campaignId].raisedAmount -= _refundAmount;

        rewardContract.burn(
            msg.sender,
            campaigns[_campaignId].rewardTokenId,
            _refundAmount
        );
        emit Refunded(_campaignId, msg.sender, block.timestamp, _refundAmount);
    }

    /** @notice Function to start a new campaign.
     * @param _target defines the goal amount need to be raised
     * @param _title defines the the title of the campaign
     * @param _image defines the the image of the campaign
     */
    function createCampaign(
        uint _target,
        uint _softcap,
        uint _rewardTokenId,
        string calldata _title,
        string calldata _image
    ) external {
        require(_rewardTokenId > 0, 'Reward token id must be greater than 0');
        require(_target > 0, 'Target amount must be greater than 0');
        require(_softcap <= _target, 'Softcap must be less than the target');
        require(
            _softcap >= (_target * 3) / 10,
            'Softcap must be at least 30% of the target'
        );
        require(bytes(_title).length > 0, "Title can't be empty");
        require(bytes(_image).length > 0, "Image can't be empty");
        for (uint i; i < campaignsCount; ++i) {
            require(
                !(campaigns[i].owner == msg.sender &&
                    campaigns[i].timeStamp + 7 days > block.timestamp),
                'You can start a new campaign every 7 days'
            );
        }
        campaigns.push(
            Campaign({
                owner: msg.sender,
                target: _target,
                softcap: _softcap,
                raisedAmount: 0,
                withdrawnAmount: 0,
                rewardTokenId: _rewardTokenId,
                timeStamp: block.timestamp,
                isOpen: true,
                title: _title,
                image: _image
            })
        );
        emit Started(
            campaigns[campaignsCount].owner,
            campaignsCount,
            _rewardTokenId,
            block.timestamp,
            campaigns[campaignsCount].target
        );
        ++campaignsCount;
    }

    /** @notice Function to close a campaign.
     * @param _campaignId defines the index of targeted campaign
     */
    function closeCampaign(
        uint _campaignId
    ) external campaignIdConstraints(_campaignId) {
        require(
            campaigns[_campaignId].owner == msg.sender,
            'Only owner can close their campaign'
        );
        require(
            campaigns[_campaignId].isOpen == true,
            'campaign is already closed'
        );

        campaigns[_campaignId].isOpen = false;
        emit Closed(_campaignId, campaigns[_campaignId].owner, block.timestamp);
    }

    /**
     * @notice Returns all campaigns in the campaigns array.
     * @return Campaign[] An array of all campaigns.
     */
    function getAllCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }

    /**
     * @notice Returns all campaigns in the campaigns array.
     * @param campaignIds An array of campaign ids.
     * @return Campaign[] An array of all campaigns.
     */
    function getCampaignsByIds(
        uint[] memory campaignIds
    ) public view returns (Campaign[] memory) {

        uint matchingCount;
        uint campaignsIdsCount = campaignIds.length;

        Campaign[] memory matchingCampaigns = new Campaign[](
            campaignsIdsCount
        );

        for (uint i; i < campaignsIdsCount; ++i) {
            if (campaignIds[i] < campaignsCount) {
                require(campaignIds[i] >= 0, 'input id must be greater than 0');
                require(
                    campaignIds[i] < campaignsCount,
                    'input id must be less than campaignsCount'
                );

                matchingCampaigns[matchingCount] = campaigns[campaignIds[i]];
                matchingCount++;
            }
        }
        // Create a new array with the correct length
        Campaign[] memory result = new Campaign[](matchingCount);
        // Copy the matching campaigns into the new array
        for (uint i; i < matchingCount; ++i) {
            result[i] = matchingCampaigns[i];
        }
        return result;
    }

    // Just for testing
    // function dummy() external view returns (uint) {
    //     return IERC20(DAI).balanceOf(msg.sender);
    // }

    //     address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    //     function single_Swap_For_Testing(address _recipient, address _tokenOut)
    //         external
    //         payable
    //         returns (uint _OutputAmount)
    //     {
    //         IWETH(WETH9).deposit{value: msg.value}();

    //         IWETH(WETH9).approve(address(SWAPROUTER), msg.value);
    //         ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
    //         .ExactInputSingleParams({
    //             tokenIn: WETH9,
    //             tokenOut: _tokenOut,
    //             // pool fee 0.05%
    //             fee: 500,
    //             recipient: _recipient,//msg.sender,
    //             deadline: block.timestamp + 300, // 5 minutes(300 seconds)
    //             amountIn: msg.value,
    //             amountOutMinimum: 0,
    //             sqrtPriceLimitX96: 0
    //         });
    //         return _OutputAmount = SWAPROUTER.exactInputSingle(params);
    //     }
}

// /** @notice Function to fund a campaign.
//   * @param _campaignId defines the index of targeted campaign
//   */
// function fundCampaign(uint _campaignId) external payable{
//     require(campaigns[_campaignId].isOpen == true, "Sadly the campaign is closed by the its owner");
//     require(campaigns[_campaignId].owner != msg.sender, "Campaign owner can't fund the campaign");
//     require(campaigns[_campaignId].owner.send(msg.value), "transfering funds error");
//     funderAmount[_campaignId][msg.sender] += msg.value;
//     campaigns[_campaignId].raisedAmount += msg.value;

//     rewardContract.mint(msg.sender, 0, msg.value);

//     emit Funded(
//         _campaignId,
//         msg.value,
//         block.timestamp,
//         msg.sender,
//         campaigns[_campaignId].owner
//     );
// }

/*
    /// @notice funding campaigns in any token
    /// @param _campaignId defines the index of targeted campaign
    /// @param _inputToken the token that user need to donate with
    /// @param _path abi encoded swap path of the token that requsted to be converted to DAI. Datatype is bytes
    /// @param _inputToken the token that user need to donate with
    function fundInToken(
        uint _campaignId,
        uint _inputAmount,
        bytes memory _path,
        address _inputToken
    ) external payable {
        require(
            campaigns[_campaignId].isOpen == true,
            'Sadly the campaign is closed by its owner'
        );
        require(
            campaigns[_campaignId].owner != msg.sender,
            "Campaign owner can't fund the campaign"
        );

        uint _fundedAmountInDai;

        if (_inputToken != DAI) {
            _fundedAmountInDai = _swapTokentoDai(
                _inputAmount,
                campaigns[_campaignId].owner,
                _path,
                _inputToken
            );
        } else {
            require(
                IERC20(_inputToken).transferFrom(
                    msg.sender,
                    campaigns[_campaignId].owner,
                    _inputAmount
                ),
                'Your tokens transfer to campaign owner failed'
            );
            _fundedAmountInDai = _inputAmount;
        }

        _finalizeFunding(_campaignId, _fundedAmountInDai);
    }
*/
