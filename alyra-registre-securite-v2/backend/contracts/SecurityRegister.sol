// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title A Security register system.
 * @author Arnaud Sene
 * @notice This smart contract aims to manage security register for companies.
 *
 * A company must have a security registers per site.
 * A security register can be split into sectors (fire, doors, gates, etc.).
 * The verification will be part of the security register on a specific type.
 * The verifier (inspector) proceed to a physical verification and then approve the verification.
 * Finally, the company validate the approval and create a NFT with metadata.
 *
 * The security register can be viewed publicly
 */
contract SecurityRegister is ERC721URIStorage {
    using Counters for Counters.Counter;

    struct CompanyRegister {
        string name;
        string addressName;
        string siret;
    }

    struct CompanySite {
        CompanyRegister company;
        string siteName;
        string siteAddressName;
    }

    struct CompanyAccount {
        address company;
        bool active;
    }

    struct VerificationTask {
        CompanySite register;
        uint _registerId;
        address verifier;
        string securityType;
        uint256 date;
        VerificationStatus taskStatus;
    }

    struct Verifier {
        string name;
        string addressName;
        string siret;
        string approvalNumber;
    }

    struct VerifierAccount {
        address verifier;
        bool active;
    }


    /**
     * @dev A workflow to manage verification status.
     *
     * Status:
     *  - WaitForApproval: The verification has been created, the verifier should validate it.
     *  - ValidatedByVerifier: The verifier validated the verification, the company should approve it.
     *  - Approved: The company approved the verification, the token is ready to be minted.
     *  - Rejected: The company rejected the verification, the token is ready to be minted.
     *  - ApprovedWithReservation: The company approved with reservation, the verifier should validate a second time.
     */
    enum VerificationStatus {
        WaitForApproval,
        ValidatedByVerifier,
        Approved,
        Rejected,
        ApprovedWithReservation
    }


    Counters.Counter private currentTaskId;
    uint private securitySectorLimit = 15;

    // Company
    // @dev Map a company address to bool
    mapping(address => bool) private companies;
    // @dev Map a company address to a site name
    mapping(address => mapping(string => CompanySite)) private companyRegisters;
    // @dev map a company address to a company account struct (delegation).
    mapping(address => CompanyAccount) private companyAccounts;
    // @dev map a company address to a verifier address.
    mapping(address => address) private companyVerifiers;
    // Verifier
    // @dev map verifier address to a verifier struct.
    mapping(address => Verifier) private verifiers;
    // @dev map a verifier address to verifier account (delegation).
    mapping(address => VerifierAccount) private verifierAccounts;
    // Verification task
    // @dev map a uint to a verification task struct.
    mapping(uint256 => VerificationTask) private verificationTasks;


    // Company
    // @dev Event emits when a register has been created.
    event RegisterCreated(
        address _addr,
        string _name,
        string _addressName,
        string _siret,
        string _siteName,
        string _siteAddressName
    );
    // @dev Event emits when a company updated an account to delegate the approval status.
    event CompanyAccountUpdated(address _company, address _account, string _name, string _firstName, string _action);

    // Verifier
    // @dev Event emits when a verifier has been been created.
    event VerifierCreated(address _verifier, string _name, string _addressName, string _siret, string _approvalNumber);
    // @dev Event emits when a verifier updated an account to delegate the validate status.
    event VerifierAccountUpdated(address _verifier, address _account, string _name, string _firstName, string _action);

    // @dev Event emits when a company added a verifier to his company.
    event VerifierAddedToCompany(address _company, address _verifier);


    // Verification tasks
    // @dev Event emits when a verification task has been created.
    event VerificationTaskCreated(
        address _company,
        address _verifier,
        uint256 _registerId,
        string _securityType,
        uint256 _taskId,
        VerificationStatus _taskStatus,
        string _siteName,
        uint256 _timestamp
    );
    // @dev Event emits when a verification task has been validated by a verifier.
    event VerificationTaskValidated(address _verifier, uint256 _taskId, VerificationStatus _taskStatus);
    // @dev Event emits when a verification task has been updated by a company.
    event VerificationTaskUpdated(address _company, uint256 _taskId, VerificationStatus _taskStatus);


    /**
     * @notice A modifier to restrict actions only for company account.
     */
    modifier onlyCompany() {
        require(companies[msg.sender] == true, "You're not a company!");
        _;
    }

    /**
     * @notice A modifier to restrict actions for all company account.
     */
    modifier onlyCompanyAndAccount() {
        require(
            companies[msg.sender] == true ||
            companyAccounts[msg.sender].active == true,
            "You're not a company or authorized account!");
        _;
    }


    /**
     * @notice A modifier to restrict actions only for verifier account.
     */
    modifier onlyVerifier() {
        require(bytes(verifiers[msg.sender].name).length > 0, "You're not a verifier!");
        _;
    }


    /**
     * @notice A modifier to restrict actions for all verifiers account.
     */
    modifier onlyVerifierAndAccount() {
        require(
            bytes(verifiers[msg.sender].name).length > 0 ||
            verifierAccounts[msg.sender].active == true,
            "You're not a verifier or authorized account!");
        _;
    }


    /**
     * @dev Initializes the contract by setting a 'base URI', a `name` and a `symbol'.
     */
    constructor() ERC721("SecurityRegister", "SR") {}

    // external functions

    /**
     * @notice Create a security register per company site.
     * @param  _name The company name.
     * @param _addressName The company address.
     * @param _siret The company siret.
     * @param _siteName The company site name.
     * emit a {RegisterCreated} event.
     */
    function createRegister(
        string calldata _name,
        string calldata _addressName,
        string calldata _siret,
        string calldata _siteName,
        string calldata _siteAddressName
    )
        external
    {
        require(
            bytes(companyRegisters[msg.sender][_siteName].siteName).length == 0,
            "Site already exists!"
        );
        require(bytes(_name).length > 0, "'_name' cannot be empty!");
        require(bytes(_addressName).length > 0, "'_addressName' cannot be empty!");
        require(bytes(_siret).length > 0, "'_siret' cannot be empty!");
        require(bytes(_siteName).length > 0, "'_siteName' cannot be empty!");
        require(bytes(_siteAddressName).length > 0, "'_siteAddressName' cannot be empty!");

        // create a company site
        companies[msg.sender] = true;
        // Create the site
        companyRegisters[msg.sender][_siteName] = CompanySite(
            CompanyRegister(_name, _addressName, _siret),
            _siteName,
            _siteAddressName
        );

        emit RegisterCreated(msg.sender, _name, _addressName, _siret, _siteName, _siteAddressName);
    }


    /**
     * @notice Update a company account to manage verification.
     * @param  _account The account address.
     * @param  _action The action to perform [ add | remove ].
     * @param  _name The account name.
     * @param  _firstName The account firstname.
     * Only Company account is able to add another account.
     * Emit a {CompanyAccountAdded} event.
     */
    function updateCompanyAccount(
        address _account,
        string calldata _name,
        string calldata _firstName,
        string calldata _action
    )
        external
        onlyCompany
    {
        require(
            keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("add")) ||
            keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("remove")),
            "Invalid action provided!"
        );

        if (keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("add")))
            companyAccounts[_account] = CompanyAccount(msg.sender, true);
        else
            companyAccounts[_account] = CompanyAccount(msg.sender, false);

        emit CompanyAccountUpdated(msg.sender, _account, _name, _firstName, _action);
    }


    /**
     * @notice Add a verifier account to manage verification.
     * @param  _account The account address.
     * @param  _action The action to perform [ add | remove].
     * @param  _name The account name.
     * @param  _firstName The account firstname.
     * Only Verifier account is able to add another account.
     * Emit a {VerifierAccountAdded} event.
     */
    function updateVerifierAccount(
        address _account,
        string calldata _name,
        string calldata _firstName,
        string calldata _action
    )
        external
        onlyVerifier
    {
        require(
            keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("add")) ||
            keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("remove")),
            "Invalid action provided!"
        );
        if (keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("add")))
            verifierAccounts[_account] = VerifierAccount(msg.sender, true);
        else
            verifierAccounts[_account] = VerifierAccount(msg.sender, false);

        emit VerifierAccountUpdated(msg.sender, _account, _name, _firstName, _action);
    }


    /**
     * @notice Add a verifier to a company.
     * @param  _verifier The verifier address.
     * Only Company account is able to add a verifier.
     * Emit a {CompanyAccountAdded} event.
     */
    function addVerifierToCompany(
        address _verifier
    )
        external
        onlyCompany
    {
        require(bytes(verifiers[_verifier].name).length > 0, "Verifier does not exists!");
        require(companyVerifiers[msg.sender] != _verifier , "Verifier already exists for this company!");

        companyVerifiers[msg.sender] = _verifier;

        emit VerifierAddedToCompany(msg.sender, _verifier);
    }


    /**
     * @notice Create a verifier account.
     * @param _name The verifier company name.
     * @param _addressName The verifier company address.
     * @param _siret The siret number.
     * @param _approvalNumber The government approval number.
     * emit a {VerifierCreated} event.
     */
    function createVerifier(
        string calldata _name,
        string calldata _addressName,
        string calldata _siret,
        string calldata _approvalNumber
    )
        external
    {
        require(
            keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked(verifiers[msg.sender].name)),
            "Verifier already exists!"
        );
        require(bytes(_siret).length > 0, "'siret' cannot be empty!");
        require(bytes(_approvalNumber).length > 0, "'approval number' cannot be empty!");
        require(companies[msg.sender] == false, "A company already exists for this account!");

        verifiers[msg.sender] = Verifier(_name, _addressName, _siret, _approvalNumber);

        emit VerifierCreated(msg.sender, _name, _addressName, _siret, _approvalNumber);
    }

    /**
     * @notice Get the company account.
     * @return The company address.
     */
    function getCompanyAccount() public onlyCompanyAndAccount view returns(address) {
        if (companyAccounts[msg.sender].active == true)
            return companyAccounts[msg.sender].company;
        return msg.sender;
    }


    /**
     * @notice Create a verification task in order to mint the NFT.
     * @param _siteName The company site name.
     * @param _securityType The security type e.g: extinguisher.
     * @param _registerId The security register ID previously created.
     * emit a {VerificationCreated} event.
     *
     * @dev _registerId must be restrict to these indexes (see securitySectorLimit)
     * 0 => 'Aeration',
     * 1 => 'PressureEquipment',
     * 2 => 'Elevator',
     * 3 => 'Noise',
     * 4 => 'Lighting',
     * 5 => 'Electricity',
     * 6 => 'Fire',
     * 7 => 'Refrigerated',
     * 8 => 'Thermal',
     * 9 => 'Gate',
     * 10 => 'IonizingRadiation',
     * 11 => 'OpticalRadiation',
     * 12 => 'ChemicalHazard',
     * 13 => 'SignalingSystem',
     * 14 => 'AirConditioningSystem'
     */
    function createVerificationTask(
        string calldata _siteName,
        string calldata _securityType,
        uint _registerId
    )
        external
        onlyCompanyAndAccount
    {
        require(_registerId < securitySectorLimit, "Security register ID does not exists!");
        require(companyVerifiers[getCompanyAccount()] != address(0) , "Verifier does not exists!");
        require(bytes(_siteName).length > 0, "'_siteName type' cannot be empty!");
        require(bytes(_securityType).length > 0, "'_securityType type' cannot be empty!");

        uint256 taskId = currentTaskId.current();
        currentTaskId.increment();
        address _company = getCompanyAccount();
        CompanySite memory _register = companyRegisters[_company][_siteName];

        verificationTasks[taskId] = VerificationTask(
            _register,
            _registerId,
            companyVerifiers[_company],
            _securityType,
            block.timestamp,
            VerificationStatus.WaitForApproval
        );

        emit VerificationTaskCreated(
            msg.sender,
            companyVerifiers[_company],
            _registerId,
            _securityType,
            taskId,
            VerificationStatus.WaitForApproval,
            _siteName,
            block.timestamp
        );
    }


    /**
     * @notice Validate a verification task once the verifier has completed his job.
     * @param _taskId The verification task id.
     * emit a {VerificationTaskValidated} event.
     */
    function validateVerificationTask(
        uint256 _taskId
    )
        external
        onlyVerifierAndAccount
    {
        require(verificationTasks[_taskId].verifier == msg.sender, "There is no verification task created!");
        require(
            verificationTasks[_taskId].taskStatus == VerificationStatus.WaitForApproval ||
            verificationTasks[_taskId].taskStatus == VerificationStatus.ApprovedWithReservation,
            "Unable to update the verification task!"
        );
        verificationTasks[_taskId].taskStatus = VerificationStatus.ValidatedByVerifier;

        emit VerificationTaskValidated(
            msg.sender,
            _taskId,
            VerificationStatus.ValidatedByVerifier
        );
    }


    /**
     * @notice Update a verification task once the verifier has validated it.
     * @param _taskId The verification task id.
     * Only company are able to manage this state.
     * emit a {VerificationTaskUpdated} event.
     */
    function updateVerificationTask(
        uint256 _taskId,
        string calldata _action
    )
        external
        onlyCompanyAndAccount
    {
        require(bytes(verificationTasks[_taskId].securityType).length > 0, "There is no verification task created!");
        require(
            verificationTasks[_taskId].taskStatus == VerificationStatus.ValidatedByVerifier,
            "Unable to approve the verification task, because it has not been validated yet!"
        );
        require(
            keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("approve")) ||
            keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("reject")) ||
            keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("approveWithReservation")),
            "Invalid action has been provided!"
        );

        VerificationStatus _verificationStatus;

        if( keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("approve"))) {
            _verificationStatus = VerificationStatus.Approved;
        }
        if (keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("reject"))) {
            _verificationStatus = VerificationStatus.Rejected;
        }
        if (keccak256(abi.encodePacked(_action)) == keccak256(abi.encodePacked("approveWithReservation"))) {
            _verificationStatus = VerificationStatus.ApprovedWithReservation;
        }

        verificationTasks[_taskId].taskStatus = _verificationStatus;
        emit VerificationTaskUpdated(msg.sender, _taskId, _verificationStatus);
    }


    /**
     * @notice Safely mints `tokenId` and transfers it to `to`.
     * @param _tokenId The token ID.
     *
     * Requirements:
     *  - Only company can mint a token.
     *  - Status must be approved or rejected.
     *
     */
    function safeMint(uint256 _tokenId, string calldata _tokenURI) external onlyCompany {
        require(
            getVerificationTaskStatus(_tokenId) == VerificationStatus.Approved ||
            getVerificationTaskStatus(_tokenId) == VerificationStatus.Rejected,
            "Unable to mint a token until status is approved or rejected!"
        );
        _mint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
    }


    // public functions

    /**
     * @notice Check if a company has been created.
     * @return true or false.
     */
    function isCompany(address _company) public view returns (bool) {
        return companies[_company] == true;
    }

    /**
     * @notice Check if a company account has been created.
     * @return true or false.
     */
    function isCompanyAccount(address _account) public view returns (bool) {
        return companyAccounts[_account].active == true;
    }


    /**
     * @notice Check that a verifier has been created.
     * @return true or false.
     */
    function isVerifier(address _verifier) public view returns (bool) {
        return bytes(verifiers[_verifier].name).length > 0;
    }


    /**
     * @notice Check if a verifier account has been created.
     * @return true or false.
     */
    function isVerifierAccount(address _account) public view returns (bool) {
        return verifierAccounts[_account].active == true;
    }


    /**
     * @notice Get a verification task status by his ID.
     * @param _taskId The verification task ID.
     * @return The verification task status.
     */
    function getVerificationTaskStatus(uint256 _taskId) public view returns (VerificationStatus) {
        require(bytes(abi.encodePacked(verificationTasks[_taskId].date)).length > 0, "taskID does not exist!");
        return verificationTasks[_taskId].taskStatus;
    }
}
