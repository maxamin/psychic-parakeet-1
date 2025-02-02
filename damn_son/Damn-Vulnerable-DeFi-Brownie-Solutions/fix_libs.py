import os

# contracts without license, to avoid compiler complaints
folders_add_license = ['.brownie/packages/Uniswap/']

# go through all folders in folders_add_license and add a license to all contracts within that folder
for folder in folders_add_license:
    # path to folder
    path = f'/home/{os.environ["USER"]}/{folder}'

    # loop recursively over all files in the path
    for root, dirs, files in os.walk(path):

        # license used for all contracts in the folder
        license_used = None
        files_without_license = {}

        for f in files:
            
            # only match soliditycontracts
            if f.endswith(".sol"):

                # check if it has a license
                with open(os.path.join(root,f),'r') as contract:
                    contents = contract.read()
                    first_line = contents.splitlines()[0]

                    # if file does not have a license add the file to the list
                    if 'SPDX-License-Identifier' not in first_line:
                        files_without_license[os.path.join(root,f)] = contents

                    # save which license if used if license_used is empty
                    if not license_used and 'SPDX-License-Identifier' in first_line:
                        license_used = first_line

        # loop over files without a license
        for filepath, contents in files_without_license.items():

            # add the license to the file
            with open(filepath,'w') as contract:
                contract.truncate(0)
                
                # if we saved a license, use that, otherwise just use GPL v3
                if license_used:
                    contract.write(f'{license_used}\n{contents}')
                else:
                    contract.write(f'// SPDX-License-Identifier: GPL-v3.0\n{contents}')


# files with solidity pragma statement that makes the compiler complain
files_with_pragma_statement_to_fix = {
    'SafeMath.sol':'.brownie/packages/Uniswap/v2-periphery@1.0.0-beta.0/contracts/libraries/'
}

versions_found = {
    'pragma solidity =0.6.6;':'pragma solidity >=0.6.6 <0.9.0;'
}

for contract, path in files_with_pragma_statement_to_fix.items():
    with open(f'/home/{os.environ["USER"]}/{path}/{contract}','r') as f:
        contents = f.read()

for contract, path in files_with_pragma_statement_to_fix.items():
    with open(f'/home/{os.environ["USER"]}/{path}/{contract}','w') as f:
        for line in contents.splitlines():
            for statement, fixed_statement in versions_found.items():
                if statement in line:
                    contents = contents.replace(statement, fixed_statement)
        f.write(contents)
