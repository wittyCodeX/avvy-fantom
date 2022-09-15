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
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
    //
  },
  etherscan: {
    apiKey: '2RJNBPSPJ8MM9FABDZJCHP5JGBY2PB7JAE', //  'RNG9JSM1TR9H5MW2QYCJQCMNYNSHU24JW7',
  },
}
