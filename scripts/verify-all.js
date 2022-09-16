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
    address: contractRegistryV1.address,
    constructorArguments: [owner.address],
  })

  // 2. Domain Contract Deployment

  await hre.run('verify:verify', {
    address: domain.address,
    constructorArguments: [
      'Fantom Name Service',
      'FNS',
      contractRegistryV1.address,
    ],
    contract: 'contracts/Domain.sol:Domain',
  })

  // 3. EVMReverseResolverV1 Contract Deployment

  await hre.run('verify:verify', {
    address: _EVMReverseResolverV1.address,
    constructorArguments: [contractRegistryV1.address],
  })

  // 4. LeasingAgentV1 Contract Deployment

  await hre.run('verify:verify', {
    address: leasingAgentV1.address,
    constructorArguments: [
      contractRegistryV1.address,
      '15731699658405033416417838394306507087307279032766355365310016737432995626672',
    ],
  })

  // 5. PublicResolverV1 Contract Deployment

  await hre.run('verify:verify', {
    address: publicResolverV1.address,
    constructorArguments: [contractRegistryV1.address],
  })

  // 6. RainbowTableV1 Contract Deployment

  await hre.run('verify:verify', {
    address: rainbowTableV1.address,
    constructorArguments: [contractRegistryV1.address],
  })

  // 7. ResolverRegistryV1 Contract Deployment

  await hre.run('verify:verify', {
    address: resolverRegistryV1.address,
    constructorArguments: [contractRegistryV1.address],
  })

  // 8. ReverseResolverRegistryV1 Contract Deployment

  await hre.run('verify:verify', {
    address: reverseResolverRegistryV1.address,
    constructorArguments: [contractRegistryV1.address],
  })

  // 9. NamespaceV1 Contract Deployment

  await hre.run('verify:verify', {
    address: namespaceV1.address,
    constructorArguments: [],
  })

  // 10. ConstraintsVerifier Contract Deployment

  await hre.run('verify:verify', {
    address: constraintsVerifier.address,
    constructorArguments: [],
  })
  // 11. ConstraintsFNSV1 Contract Deployment
  const ConstraintsFNSV1 = await hre.ethers.getContractFactory(
    'ConstraintsFNSV1',
  )
  const constraintsFNSV1 = await ConstraintsFNSV1.deploy(
    constraintsVerifier.address,
  )

  await constraintsFNSV1.deployed()
  console.log(`ConstraintsFNSV1 deployed to ${constraintsFNSV1.address}`)

  await hre.run('verify:verify', {
    address: constraintsFNSV1.address,
    constructorArguments: [constraintsVerifier.address],
  })

  // 12. PricingOracleV1 Contract Deployment
  const PricingOracleV1 = await hre.ethers.getContractFactory('PricingOracleV1')
  const pricingOracleV1 = await PricingOracleV1.deploy(
    constraintsVerifier.address,
  )
  await pricingOracleV1.deployed()
  console.log(`PricingOracleV1 deployed to ${pricingOracleV1.address}`)

  await hre.run('verify:verify', {
    address: pricingOracleV1.address,
    constructorArguments: [constraintsVerifier.address],
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
