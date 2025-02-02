from brownie import accounts, Contract, ZERO_ADDRESS, network
import json
from pathlib import Path
import rlp
from eth_utils import keccak, to_checksum_address, to_bytes

# import web3 if necessary
def import_web3():
    from web3 import Web3
    if network.show_active() == 'anvil':
        return Web3(Web3.HTTPProvider(f"http://127.0.0.1:8545"))
    else:
        return Web3(Web3.HTTPProvider(f"http://localhost:8545"))

# redefine _from and acc for local use
def define_from_acc(start=0, qty=10):
    # accounts to return
    accs = []

    # compose output
    for i in range(start, start + qty):
        accs.append(accounts[i])
        accs.append({'from':accounts[i]})

    # return values
    return tuple(accs)

# ether to wei convert
def ether_to_wei(value):
    web3 = import_web3()
    return web3.toWei(value, 'ether')

# wei to ether convert
def wte(value):
    return value / int(1e18)

# value dict for txs
def value_dict(value, unit='wei'):
    if unit=='wei':
        return {'value': value}
    if unit=='ether':
        return {'value': ether_to_wei(value)}

# set specific account's balance to a specified value using "network_setBalance"
def set_account_balance_network(account, value):
    web3 = import_web3()
    return web3.provider.make_request(f'{network.show_active()}_setBalance', [account, value])

# rad contract abi and bytecode from a json file
def load_abi_and_bytecode_json(json_file_path):
    with open(json_file_path) as json_file:
        json_data = json.load(json_file)
    try:
        return json_data['abi'], json_data['evm']['bytecode']['object']
    except:
        return json_data['abi'], json_data['bytecode']
    

# load contract from JSON ABI
def load_contract_from_abi_and_bytecode(contract_name, abi, bytecode, load_path=False, constructor_params=[], default_account=False):
    web3 = import_web3()

    if load_path:
        abi, bytecode = load_abi_and_bytecode_json(load_path)
    else:
        abi, bytecode = abi, bytecode

    # adapt constructor params
    for n,(param,t) in enumerate(constructor_params):
        constructor_params[n] = {
            'address':f'"{param}"',
            'int':param,
            'string':f'"{param}"',
            'bytes':f'"{param}"'
        }[t]
         

    # load contract from ABI and Bytecode
    contract = web3.eth.contract(abi=abi, bytecode=bytecode)
    if default_account:
        web3.eth.default_account = default_account

    # if it's a proxy, do things a little differently
    tx_hash = eval(f'contract.constructor({",".join(constructor_params)}).transact()')
    
    # return contract
    contract_address = web3.eth.wait_for_transaction_receipt(tx_hash).contractAddress
    return Contract.from_abi(contract_name, contract_address, abi=abi)


# compute address of a given contract to be deployed from
# the deployer address + nonce, as stated in the Section 7 
# of the Ethereum yellowpaper for contracts created using CREATE
def mk_contract_address(sender: str, nonce: int) -> str:
    """Create a contract address using eth-utils.
    # Modified from Mikko Ohtamaa's original answer which was later
    # edited by Utgarda
    # Obtained from https://ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-ethereum-contract-computed
    """
    sender_bytes = to_bytes(hexstr=sender)
    raw = rlp.encode([sender_bytes, nonce])
    h = keccak(raw)
    address_bytes = h[12:]
    return to_checksum_address(address_bytes)

# debug tx method
def debug_tx(tx_address):
    web3 = import_web3()
    return web3.provider.make_request('debug_traceTransaction', [tx_address])
