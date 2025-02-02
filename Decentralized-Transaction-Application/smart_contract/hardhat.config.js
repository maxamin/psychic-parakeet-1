require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/mRTQxofIkLI_GF7HZZoqN1fWO6TLS7Ky',
      accounts: ['1a5c0009993bd25d28988d107c71b2ad6a5526db8e856faed925393cd9409c62'],
    },
  },
};