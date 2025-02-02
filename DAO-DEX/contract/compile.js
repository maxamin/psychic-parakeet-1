//// Modules
const path = require('path')
const fse = require('fs-extra')
const solc = require('solc')

//// Delete entire "build folder"
const buildPath = path.resolve(__dirname, 'build')
fse.removeSync(buildPath)

//// Read "Campaign.sol"
const contractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
const source = fse.readFileSync(contractPath, 'utf8')

//// Compile both contracts to Solidity compiler
const input = {
  language: 'Solidity',
  sources: {
    contractFile: {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}

//// Write output to the "build" directory
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts
  .contractFile

fse.ensureDirSync(buildPath)
for (let contract in output) {
  fse.outputJSONSync(
    path.resolve(buildPath, `${contract}.json`),
    output[contract]
  )
}
