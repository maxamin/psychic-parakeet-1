import { expect } from "chai"
import { ethers } from "hardhat"
import { SecurityRegister } from "../typechain-types"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import {parseUnits} from "ethers";


describe( "SecurityRegister", () => {
    const deployDefaultContract = async () => {

        const SecurityRegister = await ethers.getContractFactory("SecurityRegister")
        const securityRegister = await SecurityRegister.deploy()
        const [
            owner,
            acc1,
            acc2,
            acc3,
            acc4,
            acc5
        ] = await ethers.getSigners()
        return { securityRegister, owner, acc1, acc2, acc3, acc4, acc5 }
    }

    context("Company and security register", async () => {
        let _securityRegister: SecurityRegister
        let _company1: HardhatEthersSigner
        let _company2: HardhatEthersSigner
        let _company3: HardhatEthersSigner
        let _other: HardhatEthersSigner

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
                acc3,
                acc4,
            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _company1 = acc1
            _company2 = acc2
            _company3 = acc3
            _other = acc4
        })

        // test createRegister
        // Failed
        it("prevent from adding the site twice", async () => {
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")

            await expect(_securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress"))
                .to.be.revertedWith("Site already exists!")
        })

        it("prevent from create company with an empty name", async () => {
            await expect(_securityRegister.connect(_other)
                .createRegister("", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress"))
                .to.be.revertedWith("'_name' cannot be empty!")
        })

        it("prevent from create company with an empty address", async () => {
            await expect(_securityRegister.connect(_other)
                .createRegister("fakeName", "", "fakeSiret", "fakeSiteName", "fakeSiteAddress"))
                .to.be.revertedWith("'_addressName' cannot be empty!")
        })

        it("prevent from create company with an empty siret", async () => {
            await expect(_securityRegister.connect(_other)
                .createRegister("fakeName", "fakeAddress", "", "fakeSiteName", "fakeSiteAddress"))
                .to.be.revertedWith("'_siret' cannot be empty!")
        })

        it("prevent from create company with an empty site name", async () => {
            await expect(_securityRegister.connect(_other)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "", "fakeSiteAddress"))
                .to.be.revertedWith("'_siteName' cannot be empty!")
        })

        it("prevent from create company with an empty site name", async () => {
            await expect(_securityRegister.connect(_other)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", ""))
                .to.be.revertedWith("'_siteAddressName' cannot be empty!")
        })

        // OK
        it("should add a company and emit a {RegisterCreated} event", async () => {
            await expect(_securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company1.address, "fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")
        })

        it("should add a second site to company and emit a {RegisterCreated} event", async () => {
            // 1st site
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")
            // 2nd site
            await expect(_securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName2", "fakeSiteAddress"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company1.address, "fakeName", "fakeAddress", "fakeSiret", "fakeSiteName2", "fakeSiteAddress")
        })

        it("should add 2 companies, 2 sites per company and emit a {RegisterCreated} event", async () => {
            // company 1
            // site = 1
            await expect(_securityRegister.connect(_company1)
                .createRegister("fakeName1", "fakeAddress", "fakeSiret", "fakeSiteName1", "fakeSiteAddress"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company1.address, "fakeName1", "fakeAddress", "fakeSiret", "fakeSiteName1", "fakeSiteAddress")
            // site = 2
            await expect(_securityRegister.connect(_company1)
                .createRegister("fakeName1", "fakeAddress", "fakeSiret", "fakeSiteName2", "fakeSiteAddress"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company1.address, "fakeName1", "fakeAddress", "fakeSiret", "fakeSiteName2", "fakeSiteAddress")

            // company 2
            // site = 1
            await expect(_securityRegister.connect(_company2)
                .createRegister("fakeName1", "fakeAddress", "fakeSiret", "fakeSiteName1", "fakeSiteAddress"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company2.address, "fakeName1", "fakeAddress", "fakeSiret", "fakeSiteName1", "fakeSiteAddress")
            // site = 2
            await expect(_securityRegister.connect(_company2)
                .createRegister("fakeName1", "fakeAddress", "fakeSiret", "fakeSiteName2", "fakeSiteAddress"))
                .to.emit(_securityRegister, "RegisterCreated")
                .withArgs(_company2.address, "fakeName1", "fakeAddress", "fakeSiret", "fakeSiteName2", "fakeSiteAddress")
        })

    })

    context("Company and verifier accounts", async () => {
        let _securityRegister: SecurityRegister
        let _company: HardhatEthersSigner
        let _account: HardhatEthersSigner
        let _account2: HardhatEthersSigner
        let _verifier: HardhatEthersSigner

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
                acc3,
                acc4,
            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _company = acc1
            _account = acc2
            _verifier = acc3
            _account2 = acc4
        })

        // test updateCompanyAccount
        it("prevent from adding an account if sender not the company owner", async () => {
            await expect(_securityRegister.connect(_company)
                .updateCompanyAccount(_account, "fakeName", "fakeFirstName", "add"))
                .to.be.revertedWith("You're not a company!")
        })

        it("prevent from providing an invalid action other than 'add' or 'remove'", async () => {
            await _securityRegister.connect(_company)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")

            await expect(_securityRegister.connect(_company)
                .updateCompanyAccount(_account, "fakeName", "fakeFirstName", "badAction"))
                .to.be.revertedWith("Invalid action provided!")
        })

        it("should add an account and emit an event {CompanyAccountUpdated}", async () => {
            await _securityRegister.connect(_company)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")

            await expect(_securityRegister.connect(_company)
                .updateCompanyAccount(_account, "fakeName", "fakeFirstName", "add"))
                .to.emit(_securityRegister, "CompanyAccountUpdated")
                .withArgs(_company.address, _account.address, "fakeName", "fakeFirstName", "add")
        })

        it("should remove an account and emit an event {CompanyAccountUpdated}", async () => {
            await _securityRegister.connect(_company)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")

            await expect(_securityRegister.connect(_company)
                .updateCompanyAccount(_account, "fakeName", "fakeFirstName", "remove"))
                .to.emit(_securityRegister, "CompanyAccountUpdated")
                .withArgs(_company.address, _account.address, "fakeName", "fakeFirstName", "remove")
        })


        // test updateVerifierAccount
        it("prevent from updating an account if sender not the verifier owner", async () => {
            await expect(_securityRegister.connect(_company)
                .updateVerifierAccount(_account, "fakeName", "fakeFirstName", "add"))
                .to.be.revertedWith("You're not a verifier!")
        })

        it("prevent from updating an account with an invalid action provided", async () => {
            await _securityRegister.connect(_verifier)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApproval")

            await expect(_securityRegister.connect(_verifier)
                .updateVerifierAccount(_account, "fakeName", "fakeFirstName", "badAction"))
                .to.be.revertedWith("Invalid action provided!")
        })

        it("should add an account and emit an event {VerifierAccountUpdated}", async () => {
            await _securityRegister.connect(_verifier)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApproval")

            await expect(_securityRegister.connect(_verifier)
                .updateVerifierAccount(_account, "fakeName", "fakeFirstName", "add"))
                .to.emit(_securityRegister, "VerifierAccountUpdated")
                .withArgs(_verifier.address, _account.address, "fakeName", "fakeFirstName", "add")
        })

        it("should remove an account and emit an event {VerifierAccountUpdated}", async () => {
            await _securityRegister.connect(_verifier)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApproval")

            await expect(_securityRegister.connect(_verifier)
                .updateVerifierAccount(_account, "fakeName", "fakeFirstName", "remove"))
                .to.emit(_securityRegister, "VerifierAccountUpdated")
                .withArgs(_verifier.address, _account.address, "fakeName", "fakeFirstName", "remove")
        })


        // test addVerifierToCompany
        it("prevent from adding a verifier to a company if sender not a company", async () => {
            await expect(_securityRegister.connect(_account).addVerifierToCompany(_verifier))
                .to.revertedWith("You're not a company!")
        })

        it("prevent from adding a verifier to a company that does not exist", async () => {
            // Create a company
            await _securityRegister.connect(_company)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")

            await expect(_securityRegister.connect(_company).addVerifierToCompany(_verifier))
                .to.revertedWith("Verifier does not exists!")
        })

        it("prevent from adding the verifier twice", async () => {
            // Create a company
            await _securityRegister.connect(_company)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")
            // Create a verifier
            await expect(_securityRegister.connect(_verifier)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber"))
            // Add a verifier to a company
            await _securityRegister.connect(_company).addVerifierToCompany(_verifier)

            await expect(_securityRegister.connect(_company).addVerifierToCompany(_verifier))
                .to.be.revertedWith("Verifier already exists for this company!")
        })

        it("should add a verifier to a company and emit an event {VerifierAddedToCompany}", async () => {
            // Create a company
            await _securityRegister.connect(_company)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")
            // Create a verifier
            await expect(_securityRegister.connect(_verifier)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber"))

            await expect(_securityRegister.connect(_company).addVerifierToCompany(_verifier))
                .to.emit(_securityRegister, "VerifierAddedToCompany")
                .withArgs(_company.address, _verifier.address)
        })
    })

    context("Verifier", async () => {
        let _securityRegister: SecurityRegister
        let _verifier1: HardhatEthersSigner
        let _company1: HardhatEthersSigner

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _verifier1 = acc1
            _company1 = acc2
        })

        // test createVerifier
        it("prevent from creating the same verifier name", async () => {
            await _securityRegister.connect(_verifier1).createVerifier(
                "fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await expect(_securityRegister.connect(_verifier1).createVerifier(
                "fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber"))
                .to.be.revertedWith("Verifier already exists!")
        })

        it("prevent from not providing a siret", async () => {
            await expect(_securityRegister.connect(_verifier1).createVerifier(
                "fakeName", "fakeAddress", "", "fakeApprovalNumber"))
                .to.be.revertedWith("'siret' cannot be empty!")
        })

        it("prevent from not providing an approval number", async () => {
            await expect(_securityRegister.connect(_verifier1).createVerifier(
                "fakeName", "fakeAddress", "fakeSiret", ""))
                .to.be.revertedWith("'approval number' cannot be empty!")
        })

        it("prevent from creating a verifier as a company", async () => {
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")

            await expect(_securityRegister.connect(_company1).createVerifier(
                "fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber"))
                .to.be.revertedWith("A company already exists for this account!")
        })

        it("should emit an event at verifier creation", async () => {
            await expect(_securityRegister.connect(_verifier1).createVerifier(
                "fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber"))
                .to.emit(_securityRegister, "VerifierCreated")
                .withArgs(_verifier1.address, "fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
        })
    })

    context("Verification task", async () => {
        let _securityRegister: SecurityRegister
        let _company1: HardhatEthersSigner
        let _verifier1: HardhatEthersSigner
        let _delegatedAccount1: HardhatEthersSigner

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
                acc3,
            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _company1 = acc1
            _verifier1 = acc2
            _delegatedAccount1 = acc3
        })

        // test getCompanyAccount
        it("prevent from retrieving a company address with a unauthorized account", async () => {
            await expect(_securityRegister.connect(_verifier1).getCompanyAccount())
                .to.be.revertedWith("You're not a company or authorized account!")
        })

        it("should retrieve a company address by using a delegated account", async () => {
            // Add delegated account
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")

            await _securityRegister.connect(_company1)
                .updateCompanyAccount(_delegatedAccount1, "fakeName", "fakeFirstName", "add")

            expect(await _securityRegister.connect(_delegatedAccount1).getCompanyAccount())
                .to.be.equal(_company1.address)
        })

        it("should retrieve a company address by using the company account", async () => {
            // Add delegated account
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")

            expect(await _securityRegister.connect(_company1).getCompanyAccount())
                .to.be.equal(_company1.address)
        })

        // Test createVerificationTask
        it("prevent from creating a verification task without a company", async () => {
            await expect(_securityRegister.connect(_company1)
                .createVerificationTask("fakeSiteName", "fakeSecurityType", 0))
                .to.be.revertedWith("You're not a company or authorized account!")
        })

        it("prevent from creating a verification task with a invalid registerId > 15", async () => {
            // Create a register by a company
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")

            await expect(_securityRegister.connect(_company1)
                .createVerificationTask("fakeSiteName", "fakeSecurityType", 16))
                .to.be.revertedWith("Security register ID does not exists!")
        })

        it("prevent from creating a verification task by company without a verifier", async () => {
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")

            await expect(_securityRegister.connect(_company1)
                .createVerificationTask("fakeSiteName", "fakeSecurityType", 0))
                .to.be.revertedWith("Verifier does not exists!")
        })

        it("prevent from creating a verification task with siteName empty", async () => {
            // Create a  register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")
            // Add verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)

            await expect(_securityRegister.connect(_company1).createVerificationTask("", "fakeSecurityType", 0))
                .to.be.revertedWith("'_siteName type' cannot be empty!")
        })

        it("prevent from creating a verification task with securityType empty", async () => {
            // Create a  register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")

            // Add verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)

            await expect(_securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "", 0))
                .to.be.revertedWith("'_securityType type' cannot be empty!")
        })


        // ok
        it("should create a verification task by company account and emit a {VerificationTaskCreated} event",async () => {
            // Create a  register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")

            // Add verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)

            await _securityRegister.connect(_company1)
                .createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Get events
            const VerificationTaskCreated = 'event VerificationTaskCreated(address _company, address _verifier, uint256 _registerId, string _securityType, uint256 _taskId, uint8 _taskStatus, string _siteName, uint256 _timestamp)'
            const events = await _securityRegister.queryFilter(VerificationTaskCreated);
            const eventData = events[0].args;

            // 1689978440 timestamp at this moment

            expect(eventData._company).to.equal(_company1.address);
            expect(eventData._verifier).to.equal(_verifier1.address);
            expect(eventData._registerId).to.equal(0);
            expect(eventData._securityType).to.equal("fakeSecurityType");
            expect(eventData._taskId).to.equal(0);
            expect(eventData._taskStatus).to.equal(0);
            expect(eventData._siteName).to.equal("fakeSiteName");
            expect(eventData._timestamp).to.greaterThan(1689978440n);
        })

        it("should create a verification task by delegated company account and emit a {VerificationTaskCreated} event",async () => {
            // Create a  register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")

            // Create verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")

            // Add delegated account
            await _securityRegister.connect(_company1)
                .updateCompanyAccount(_delegatedAccount1, "fakeName", "fakeFirstName", "add")

            // Assign a verifier to a company
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)

            await _securityRegister.connect(_delegatedAccount1)
                .createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Get events
            const events = await _securityRegister.queryFilter("VerificationTaskCreated");
            const eventData = events[0].args;

            // 1689978440 timestamp at this moment

            expect(eventData._company).to.equal(_delegatedAccount1.address);
            expect(eventData._verifier).to.equal(_verifier1.address);
            expect(eventData._registerId).to.equal(0);
            expect(eventData._securityType).to.equal("fakeSecurityType");
            expect(eventData._taskId).to.equal(0);
            expect(eventData._taskStatus).to.equal(0);
            expect(eventData._siteName).to.equal("fakeSiteName");
            expect(eventData._timestamp).to.greaterThan(1689978440n);
        })

        // test getVerificationTaskStatus
        it("should get the task status => 0",async () => {
            // Create a  register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")

            // Add verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)

            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)

            expect(await _securityRegister.getVerificationTaskStatus(0)).to.be.equal(BigInt("0"))
        })

        it("prevent from providing a invalid taskId",async () => {
            expect(await _securityRegister.getVerificationTaskStatus(999))
                .to.be.revertedWith("taskID does not exist!")
        })
    })

    context("Validate a verification task by a verifier", async () => {
        let _securityRegister: SecurityRegister
        let _company1: HardhatEthersSigner
        let _verifier1: HardhatEthersSigner

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _company1 = acc1
            _verifier1 = acc2
        })

        // test validateVerificationTask
        it("prevent from updating a verification task as a non verifier", async () => {
            await expect(_securityRegister.connect(_verifier1).validateVerificationTask(0))
                .to.be.revertedWith("You're not a verifier or authorized account!")
        })

        it("prevent from updating a verification task with no task created", async () => {
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")

            await expect(_securityRegister.connect(_verifier1).validateVerificationTask(0))
                .to.be.revertedWith("There is no verification task created!")
        })

        it("prevent from updating a verification task while status is rejected", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by the verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            // Reject the verification by the company
            await _securityRegister.connect(_company1).updateVerificationTask(0, "reject")

            await expect(_securityRegister.connect(_verifier1).validateVerificationTask(0))
                .to.be.revertedWith("Unable to update the verification task!")
        })

        it("prevent from updating a verification task while status is approved", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by the verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            // Approve the verification by the company
            await _securityRegister.connect(_company1).updateVerificationTask(0, "approve")

            await expect(_securityRegister.connect(_verifier1).validateVerificationTask(0))
                .to.be.revertedWith("Unable to update the verification task!")
        })

        it("should update a verification task and emit {VerificationTaskValidated} event", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)

            await expect(_securityRegister.connect(_verifier1).validateVerificationTask(0))
                .to.be.emit(_securityRegister, "VerificationTaskValidated")
                .withArgs(_verifier1.address, 0, 1)
        })

        it("should update a verification task and get the status = 1", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeSiteAddress")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by the verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            expect(await _securityRegister.getVerificationTaskStatus(0)).to.be.equal(BigInt("1"))
        })
    })

    context("Manage a verification task status by a company", async () => {
        let _securityRegister: SecurityRegister
        let _company1: HardhatEthersSigner
        let _verifier1: HardhatEthersSigner
        let _companyAccount1: HardhatEthersSigner

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
                acc3,
            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _company1 = acc1
            _verifier1 = acc2
            _companyAccount1 = acc3
        })

        // test updateVerificationTask
        it("prevent from doing actions on a verification task as non company account", async () => {
            const actions = ["approve", "reject", "approveWithRestriction"]
            for (let action in actions) {
                await expect(_securityRegister.connect(_verifier1).updateVerificationTask(0, action))
                    .to.be.revertedWith("You're not a company or authorized account!")
            }
        })

        it("prevent from doing actions on a verification task with no task created", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")

            const actions = ["approve", "reject", "approveWithRestriction"]
            for (let action in actions) {
                await expect(_securityRegister.connect(_company1).updateVerificationTask(0, action))
                    .to.be.revertedWith("There is no verification task created!")
            }
        })


        it("prevent from doing actions on a verification task with status not validated by verifier", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)

            const actions = ["approve", "reject", "approveWithRestriction"]
            for (let action in actions) {
                await expect(_securityRegister.connect(_company1).updateVerificationTask(0, action))
                    .to.be.revertedWith("Unable to approve the verification task, because it has not been validated yet!")
            }
        })


        it("prevent from providing an invalid parameter", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            await expect(_securityRegister.connect(_company1).updateVerificationTask(0, "badParam"))
                .to.revertedWith("Invalid action has been provided!")
        })

        // OK
        it("should approve a verification task and emit {VerificationTaskUpdated} event", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Add an account
            await _securityRegister.connect(_company1).updateCompanyAccount(_companyAccount1, "fakeName", "fakeFirstName", "add")

            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            await expect(_securityRegister.connect(_company1).updateVerificationTask(0, "approve"))
                .to.be.emit(_securityRegister, "VerificationTaskUpdated")
                .withArgs(_company1.address, 0, 2)

        })

        it("should approve a verification task and emit {VerificationTaskUpdated} event  with delegated account", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Add an account
            await _securityRegister.connect(_company1).updateCompanyAccount(_companyAccount1, "fakeName", "fakeFirstName", "add")

            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            // as a company account delegated
            await expect(_securityRegister.connect(_companyAccount1).updateVerificationTask(0, "approve"))
                .to.be.emit(_securityRegister, "VerificationTaskUpdated")
                .withArgs(_companyAccount1.address, 0, 2)
        })

        it("should approve a verification task and get the status = 2", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            // Approve the verification task by the company
            await _securityRegister.connect(_company1).updateVerificationTask(0, "approve")

            expect(await _securityRegister.getVerificationTaskStatus(0)).to.be.equal(BigInt("2"))
        })

        it("should approve a verification task and get the status = 2 with delegated account", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Add an account
            await _securityRegister.connect(_company1).updateCompanyAccount(_companyAccount1, "fakeName", "fakeFirstName", "add")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            // Approve the verification task by the company
            await _securityRegister.connect(_companyAccount1).updateVerificationTask(0, "approve")

            expect(await _securityRegister.getVerificationTaskStatus(0)).to.be.equal(BigInt("2"))
        })

        it("should reject a verification task and emit {VerificationTaskUpdated} event", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            await expect(_securityRegister.connect(_company1).updateVerificationTask(0, "reject"))
                .to.be.emit(_securityRegister, "VerificationTaskUpdated")
                .withArgs(_company1.address, 0, 3)
        })

        it("should reject a verification task and emit {VerificationTaskUpdated} event with delegated account", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Add an account
            await _securityRegister.connect(_company1).updateCompanyAccount(_companyAccount1, "fakeName", "fakeFirstName", "add")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            await expect(_securityRegister.connect(_companyAccount1).updateVerificationTask(0, "reject"))
                .to.be.emit(_securityRegister, "VerificationTaskUpdated")
                .withArgs(_companyAccount1.address, 0, 3)
        })



        it("should reject a verification task and get the status = 2", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            // Reject the verification task by the company
            await _securityRegister.connect(_company1).updateVerificationTask(0, "reject")

            expect(await _securityRegister.getVerificationTaskStatus(0)).to.be.equal(BigInt("3"))
        })

        it("should reject a verification task and get the status = 2 with delegated account", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Add an account
            await _securityRegister.connect(_company1).updateCompanyAccount(_companyAccount1, "fakeName", "fakeFirstName", "add")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            // Reject the verification task by the company
            await _securityRegister.connect(_companyAccount1).updateVerificationTask(0, "reject")

            expect(await _securityRegister.getVerificationTaskStatus(0)).to.be.equal(BigInt("3"))
        })

        it("should approve with reservation a verification task and emit {VerificationTaskUpdated} event", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            await expect(_securityRegister.connect(_company1).updateVerificationTask(0, "approveWithReservation"))
                .to.be.emit(_securityRegister, "VerificationTaskUpdated")
                .withArgs(_company1.address, 0, 4)
        })

        it("should approve with reservation a verification task and emit {VerificationTaskUpdated} event with delegated account", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Add an account
            await _securityRegister.connect(_company1).updateCompanyAccount(_companyAccount1, "fakeName", "fakeFirstName", "add")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            await expect(_securityRegister.connect(_companyAccount1).updateVerificationTask(0, "approveWithReservation"))
                .to.be.emit(_securityRegister, "VerificationTaskUpdated")
                .withArgs(_companyAccount1.address, 0, 4)
        })

        it("should approve with reservation a verification task and get the status = 3", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            // Approve with restriction the verification task by the company
            await _securityRegister.connect(_company1).updateVerificationTask(0, "approveWithReservation")

            expect(await _securityRegister.getVerificationTaskStatus(0)).to.be.equal(BigInt("4"))
        })

        it("should approve with reservation a verification task and get the status = 3 with delegated account", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Add an account
            await _securityRegister.connect(_company1).updateCompanyAccount(_companyAccount1, "fakeName", "fakeFirstName", "add")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            // Approve with restriction the verification task by the company
            await _securityRegister.connect(_companyAccount1).updateVerificationTask(0, "approveWithReservation")

            expect(await _securityRegister.getVerificationTaskStatus(0)).to.be.equal(BigInt("4"))
        })

    })

    context("Mint token", async () => {
        let _securityRegister: SecurityRegister
        let _company1: HardhatEthersSigner
        let _verifier1: HardhatEthersSigner
        let _company2: HardhatEthersSigner
        let _verifier2: HardhatEthersSigner
        let _company3: HardhatEthersSigner
        const _tokenURI: string = "https://ipfs.io/ipfs/Qmeb4pBA14imEP13FJ1EnwgfHXVg9t4gA3Ue3eFe7UAftN/"

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
                acc3,
                acc4,
                acc5,

            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _company1 = acc1
            _verifier1 = acc2
            _company2 = acc3
            _verifier2 = acc4
            _company3 = acc5
        })

        // test safeMint
        it("prevent from minting a token if sender is not a company account", async () => {
            await expect(_securityRegister.connect(_verifier1).safeMint(0, _tokenURI))
                .revertedWith("You're not a company!")
        })

        it("prevent from minting a token while status is not approved or rejected", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)

            await expect(_securityRegister.connect(_company1).safeMint(0, _tokenURI))
                .to.be.revertedWith("Unable to mint a token until status is approved or rejected!")
        })

        it("should mint a token and emit {Transfer} event", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            // Approve the verification task by the company
            await _securityRegister.connect(_company1).updateVerificationTask(0, "approve")

            await expect(_securityRegister.connect(_company1).safeMint(0, _tokenURI))
                .to.be.emit(_securityRegister, "Transfer")
                .withArgs(("0x0000000000000000000000000000000000000000"), _company1.address, 0)
        })

        it("should mint a token and emit {MetadataUpdate} event", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            // Approve the verification task by the company
            await _securityRegister.connect(_company1).updateVerificationTask(0, "approve")

            await expect(_securityRegister.connect(_company1).safeMint(0, _tokenURI))
                .to.be.emit(_securityRegister, "MetadataUpdate")
                .withArgs(0)
        })

        // tokenUri
        it("prevent from getting a tokenURI with invalid tokenId", async () => {
            await expect(_securityRegister.tokenURI("0")).to.be.revertedWith("ERC721: invalid token ID")
        })

        it("should get a tokenURI for 1 task with tokenId = 0", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Create a verifier
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            await _securityRegister.connect(_company1).addVerifierToCompany(_verifier1)
            // Create a verification task
            await _securityRegister.connect(_company1).createVerificationTask("fakeSiteName", "fakeSecurityType", 0)
            // Validate the verification task by verifier
            await _securityRegister.connect(_verifier1).validateVerificationTask(0)
            // Approve the verification task by the company
            await _securityRegister.connect(_company1).updateVerificationTask(0, "approve")
            // Mint the register by the company
            await _securityRegister.connect(_company1).safeMint(0, `${_tokenURI}0`)

            expect(await _securityRegister.tokenURI("0")).to.be.equal(`${_tokenURI}0`)
        })

    })

    context("Some getters", async () => {
        let _securityRegister: SecurityRegister
        let _company1: HardhatEthersSigner
        let _verifier1: HardhatEthersSigner
        let _account1: HardhatEthersSigner
        let _account2: HardhatEthersSigner

        beforeEach(async () => {

            const {
                securityRegister,
                acc1,
                acc2,
                acc3,
                acc4,

            } = await deployDefaultContract()

            _securityRegister = securityRegister
            _company1 = acc1
            _verifier1 = acc2
            _account1 = acc3
            _account2 = acc4
        })

        // test isCompany
        it("should get false if a company has not been created", async () => {
            expect(await _securityRegister.isCompany(_company1)).to.be.equal(false)
        })

        it("should get true  if a company has been created", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")

            expect(await _securityRegister.isCompany(_company1)).to.be.equal(true)
        })

        // test isCompanyAccount
        it("should get false if a company has not been added an account", async () => {
            expect(await _securityRegister.isCompanyAccount(_company1)).to.be.equal(false)
        })

        it("should get true  if a company has been added an account", async () => {
            // Create a register
            await _securityRegister.connect(_company1)
                .createRegister("fakeName", "fakeAddress", "fakeSiret", "fakeSiteName", "fakeAddressName")
            // Add a company account
            await _securityRegister.connect(_company1)
                .updateCompanyAccount(_account1, "fakeName", "fakeFirstName", "add")

            expect(await _securityRegister.isCompanyAccount(_account1)).to.be.equal(true)
        })

        // test isVerifier
        it("should get false if a verifier has not been created", async () => {
            expect(await _securityRegister.isVerifier(_company1)).to.be.equal(false)
        })

        it("should get true  if a verifier has been created", async () => {
            // Create a verifier
            await _securityRegister.connect(_company1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")

            expect(await _securityRegister.isVerifier(_company1)).to.be.equal(true)
        })

        // test isVerifierAccount
        it("should get false if a verifier has not been added an account", async () => {
            expect(await _securityRegister.isVerifierAccount(_account1)).to.be.equal(false)
        })

        it("should get true  if a verifier has been added an account", async () => {
            // Create a register
            await _securityRegister.connect(_verifier1)
                .createVerifier("fakeName", "fakeAddress", "fakeSiret", "fakeApprovalNumber")
            // Add a company account
            await _securityRegister.connect(_verifier1)
                .updateVerifierAccount(_account1, "fakeName", "fakeFirstName", "add")

            expect(await _securityRegister.isVerifierAccount(_account1)).to.be.equal(true)
        })
    })
})