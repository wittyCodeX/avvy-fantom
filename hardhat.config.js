// require('@nomicfoundation/hardhat-toolbox')
require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.0',
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    fantomtest: {
      url: 'https://rpc.testnet.fantom.network',
      accounts: [process.env.PRIVATE_KEY],
      chainId: 4002,
      live: false,
      saveDeployments: true,
      gasMultiplier: 2,
    },
  },
  etherscan: {
    apiKey: 'RNG9JSM1TR9H5MW2QYCJQCMNYNSHU24JW7',
  },
}
