// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat')

async function main() {
  const [owner] = await ethers.getSigners()

  // 1. ContractRegistryV1 Contract Deployment
  await hre.run('verify:verify', {
    address: '0xFecc65EEa5CAd2d994b71f7145ae205B7D3E4bf5',
    constructorArguments: [owner.address],
  })

  // 2. Domain Contract Deployment

  await hre.run('verify:verify', {
    address: '0xC569D541B8c908DEC24bd02baDA74078C6A58ec1',
    constructorArguments: [
      'Fantom Name Service',
      'FNS',
      '0xFecc65EEa5CAd2d994b71f7145ae205B7D3E4bf5',
    ],
    contract: 'contracts/Domain.sol:Domain',
  })

  // 3. EVMReverseResolverV1 Contract Deployment
  await hre.run('verify:verify', {
    address: '0xF2Fa2Ab016f11D32Ac89B184C090ee5ff000973A',
    constructorArguments: ['0xFecc65EEa5CAd2d994b71f7145ae205B7D3E4bf5'],
  })

  // 4. LeasingAgentV1 Contract Deployment

  await hre.run('verify:verify', {
    address: '0xaB8f2003C232187940B9FF1FeCb9F3F278370f3e',
    constructorArguments: [
      '0xFecc65EEa5CAd2d994b71f7145ae205B7D3E4bf5',
      '15731699658405033416417838394306507087307279032766355365310016737432995626672',
    ],
  })

  // 5. PublicResolverV1 Contract Deployment
  await hre.run('verify:verify', {
    address: '0xaA9bCc8515e5D76EBd30769295330E26724a5a54',
    constructorArguments: ['0xFecc65EEa5CAd2d994b71f7145ae205B7D3E4bf5'],
  })

  // 6. RainbowTableV1 Contract Deployment
  await hre.run('verify:verify', {
    address: '0x0Cf72077e3632528B5a792BD378Fa47d1061A187',
    constructorArguments: ['0xFecc65EEa5CAd2d994b71f7145ae205B7D3E4bf5'],
  })

  // 7. ResolverRegistryV1 Contract Deployment

  await hre.run('verify:verify', {
    address: '0xe6EA8Cc5b35e28E669264c967b4d4Ef524B27B06',
    constructorArguments: ['0xFecc65EEa5CAd2d994b71f7145ae205B7D3E4bf5'],
  })

  // 8. ReverseResolverRegistryV1 Contract Deployment

  await hre.run('verify:verify', {
    address: '0xb1182f674FeB8FaF43D91B48F4172D6b765e5539',
    constructorArguments: ['0xFecc65EEa5CAd2d994b71f7145ae205B7D3E4bf5'],
  })

  // 9. NamespaceV1 Contract Deployment

  await hre.run('verify:verify', {
    address: '0xF1fDaC2702bF7C7a11Bba80798Ead3F89c113632',
    constructorArguments: [],
  })

  // 10. ConstraintsVerifier Contract Deployment

  await hre.run('verify:verify', {
    address: '0x2116B4FfD4048208a7e1b094582f8e32e090a888',
    constructorArguments: [],
  })

  // 11. ConstraintsFNSV1 Contract Deployment

  await hre.run('verify:verify', {
    address: '0x92FEfEf8583A72b9f05DDA072e0bCC738a76E92E',
    constructorArguments: ['0x2116B4FfD4048208a7e1b094582f8e32e090a888'],
  })

  // 12. PricingOracleV1 Contract Deployment
  await hre.run('verify:verify', {
    address: '0x1A0ce5Eb9f70881416490f55Ba71Eb3a62c06647',
    constructorArguments: ['0x2116B4FfD4048208a7e1b094582f8e32e090a888'],
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
