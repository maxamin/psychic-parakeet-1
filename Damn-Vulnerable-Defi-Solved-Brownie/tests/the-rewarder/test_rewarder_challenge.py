import pytest
import brownie
from brownie import FlashLoanerPool, TheRewarderPool, DamnValuableToken, RewardToken, AccountingToken
from brownie import AttackRewarder
from brownie import accounts , Wei , exceptions, chain

deployer, alice, bob, charlie, david, attacker = None, None, None, None, None, None
users = [alice, bob, charlie, david]

# Pool has 1M * 10**18 tokens
TOKENS_IN_LENDER_POOL = Wei('1_000_000 ether')  

#--  [ SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE ] --#
@pytest.fixture(scope="module")
def contracts():

    global deployer, alice, bob, charlie, david, attacker, users
    deployer, alice, bob, charlie, david, attacker = accounts[0:6]
    users = [alice, bob, charlie, david]

    contracts = {}

    liquidityToken =  DamnValuableToken.deploy({"from":deployer})
    flashLoanPool =  FlashLoanerPool.deploy(liquidityToken.address, {"from":deployer})

    # Set initial token balance of the pool offering flash loans
    liquidityToken.transfer(flashLoanPool.address, TOKENS_IN_LENDER_POOL, {"from":deployer})

    rewarderPool =  TheRewarderPool.deploy(liquidityToken.address, {"from":deployer})
    rewardToken =  RewardToken.at(rewarderPool.rewardToken())
    accountingToken =  AccountingToken.at(rewarderPool.accToken())

    # Alice, Bob, Charlie and David deposit 100 tokens each
    for user in users: 
        amount = Wei('100 ether')
        liquidityToken.transfer(user.address, amount, {"from":deployer})
        liquidityToken.approve(rewarderPool.address, amount, {"from":user})
        rewarderPool.deposit(amount, {"from":user})
        assert accountingToken.balanceOf(user.address) == amount
    assert accountingToken.totalSupply() == Wei('400 ether')
    assert rewardToken.totalSupply() == '0'

    chain.sleep(5 * 24 * 60 * 60)
    chain.mine(1)
          
    # Each depositor gets 25 reward tokens
    for user in users:
        rewarderPool.distributeRewards({"from":user})
        assert rewardToken.balanceOf(user.address) == Wei('25 ether')
    assert rewardToken.totalSupply() == Wei('100 ether')

    # Attacker starts with zero DVT tokens in balance
    assert liquidityToken.balanceOf(attacker.address) == '0'
    
    # Two rounds should have occurred so far
    assert rewarderPool.roundNumber() == '2'

    contracts['liquidityToken'] = liquidityToken
    contracts["flashLoanPool"] = flashLoanPool
    contracts["rewarderPool"] = rewarderPool
    contracts['rewardToken'] = rewardToken
    contracts['AccountingToken'] = accountingToken

    yield contracts

    #---  [ SUCCESS CONDITIONS ]  ---#
    
    # Only one round should have taken place
    assert rewarderPool.roundNumber() == '3'

     # Users should get neglegible rewards this round
    for user in users:
        rewarderPool.distributeRewards({"from":user})
        rewards = rewardToken.balanceOf(user.address)
        
    # The difference between current and previous rewards balance should be lower than 0.01 tokens
    delta = rewards - Wei('25 ether')
    assert  delta < Wei(1e16)
        
    # Rewards must have been issued to the attacker account
    assert rewardToken.totalSupply() > Wei('100 ether')
    rewards = rewardToken.balanceOf(attacker.address)
        
    # The amount of rewards earned should be really close to 100 tokens
    delta = Wei('100 ether') - (rewards)
    assert delta < Wei(1e17)
    
    # Attacker finishes with zero DVT tokens in balance
    assert liquidityToken.balanceOf(attacker.address) == ('0')


def test_rewarder_challenge(contracts):
    #-- [ CODE YOUR EXPLOIT HERE ] ---#
    attackRewarder = AttackRewarder.deploy(
            contracts['rewarderPool'].address,
            contracts['flashLoanPool'].address,
            contracts['liquidityToken'].address,
            {"from":attacker}
    )

    # Advance time 5 days so that depositors can get rewards
    chain.sleep(5 * 24 * 60 * 60)
    chain.mine(1)

    attackRewarder.attack(TOKENS_IN_LENDER_POOL, attacker.address, {"from":attacker})
    #_________________________________#
