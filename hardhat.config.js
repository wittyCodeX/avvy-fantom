// require('@nomicfoundation/hardhat-toolbox')
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: '0.8.3' },
      { version: '0.8.0' },
      { version: '0.7.6' },
      { version: '0.6.12' },
      { version: '0.5.17' },
    ],
  },
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    fantomtest: {
      url: 'https://rpc.testnet.fantom.network/',
      accounts: [process.env.PRIVATE_KEY],
      chainId: 4002,
      live: false,
      saveDeployments: true,
      gasMultiplier: 2,
    },
    fantom: {
      url: 'https://rpc.fantom.network',
      accounts: [process.env.PRIVATE_KEY],
      chainId: 250,
      live: false,
      saveDeployments: true,
      gasMultiplier: 2,
    },
  },
  etherscan: {
    apiKey: 'RNG9JSM1TR9H5MW2QYCJQCMNYNSHU24JW7',
  },
}
