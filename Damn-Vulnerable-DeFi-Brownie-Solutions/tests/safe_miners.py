from scripts.utils import *
from brownie import DamnValuableToken

def test_solve_challenge():
    ####################################################################
    ######### SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE #########
    ####################################################################

    # deposit token amount and address
    DEPOSIT_TOKEN_AMOUNT = ether_to_wei(2000042)
    DEPOSIT_ADDRESS = '0x79658d35aB5c38B6b988C23D02e0410A380B8D5c'

    # accounts
    deployer, _fromDeployer, attacker, _fromAttacker = define_from_acc(qty=2)

    # Deploy Damn Valuable Token contract
    token = DamnValuableToken.deploy(_fromDeployer)

    # Deposit the DVT tokens to the address
    token.transfer(DEPOSIT_ADDRESS, DEPOSIT_TOKEN_AMOUNT, _fromDeployer)

    # Ensure initial balances are correctly set
    assert token.balanceOf(DEPOSIT_ADDRESS) == DEPOSIT_TOKEN_AMOUNT
    assert token.balanceOf(attacker.address) == 0

    # check if solved
    def check_solution():
        ############################################
        ############ SUCCESS CONDITIONS ############
        ############################################

        # The attacker took all tokens available in the deposit address
        assert token.balanceOf(DEPOSIT_ADDRESS) == 0
        assert token.balanceOf(attacker.address) == DEPOSIT_TOKEN_AMOUNT

# #########################################################
# Somebody has sent +2 million DVT tokens to 0x79658d35aB5c38B6b988C23D02e0410A380B8D5c. But the address is empty, isn't it?
#
# To pass this challenge, you have to take all tokens out.
#
# You may need to use prior knowledge, safely. 
# #########################################################

    ##############################
    ##### SOLUTION GOES HERE #####
    ##############################
    
    ######################
    check_solution()
