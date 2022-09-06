// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat')

async function main() {
  const [owner] = await ethers.getSigners()

  // ContractRegistryV1 Contract Deployment
  const ContractRegistryV1 = await hre.ethers.getContractFactory(
    'ContractRegistryV1',
  )
  const contractRegistryV1 = await ContractRegistryV1.deploy(owner.address)

  await contractRegistryV1.deployed()

  console.log(`ContractRegistryV1 deployed to ${contractRegistryV1.address}`)

  // Domain Contract Deployment
  const Domain = await hre.ethers.getContractFactory(
    'contracts/Domain.sol:Domain',
  )
  const domain = await Domain.deploy(
    'FTMvy Domains',
    'FTMVY',
    contractRegistryV1.address,
  )

  await domain.deployed()

  console.log(`Domain deployed to ${domain.address}`)

  // EVMReverseResolverV1 Contract Deployment
  const EVMReverseResolverV1 = await hre.ethers.getContractFactory(
    'EVMReverseResolverV1',
  )
  const _EVMReverseResolverV1 = await EVMReverseResolverV1.deploy(
    contractRegistryV1.address,
  )

  await _EVMReverseResolverV1.deployed()

  console.log(
    `EVMReverseResolverV1 deployed to ${_EVMReverseResolverV1.address}`,
  )
  // LeasingAgentV1 Contract Deployment
  const LeasingAgentV1 = await hre.ethers.getContractFactory('LeasingAgentV1')
  const leasingAgentV1 = await LeasingAgentV1.deploy(
    contractRegistryV1.address,
    0,
  )

  await leasingAgentV1.deployed()

  console.log(`LeasingAgentV1 deployed to ${leasingAgentV1.address}`)

  // PublicResolverV1 Contract Deployment
  const PublicResolverV1 = await hre.ethers.getContractFactory(
    'PublicResolverV1',
  )
  const publicResolverV1 = await PublicResolverV1.deploy(
    contractRegistryV1.address,
  )

  await publicResolverV1.deployed()

  console.log(`PublicResolverV1 deployed to ${publicResolverV1.address}`)

  // RainbowTableV1 Contract Deployment
  const RainbowTableV1 = await hre.ethers.getContractFactory('RainbowTableV1')
  const rainbowTableV1 = await RainbowTableV1.deploy(contractRegistryV1.address)

  await rainbowTableV1.deployed()

  console.log(`RainbowTableV1 deployed to ${rainbowTableV1.address}`)

  // ResolverRegistryV1 Contract Deployment
  const ResolverRegistryV1 = await hre.ethers.getContractFactory(
    'ResolverRegistryV1',
  )
  const resolverRegistryV1 = await ResolverRegistryV1.deploy(
    contractRegistryV1.address,
  )

  await resolverRegistryV1.deployed()

  console.log(`ResolverRegistryV1 deployed to ${resolverRegistryV1.address}`)

  // ReverseResolverRegistryV1 Contract Deployment
  const ReverseResolverRegistryV1 = await hre.ethers.getContractFactory(
    'ResolverRegistryV1',
  )
  const reverseResolverRegistryV1 = await ReverseResolverRegistryV1.deploy(
    contractRegistryV1.address,
  )

  await reverseResolverRegistryV1.deployed()

  console.log(
    `ReverseResolverRegistryV1 deployed to ${reverseResolverRegistryV1.address}`,
  )

  // ContractRegistryV1 Contract Deployment
  const NamespaceV1 = await hre.ethers.getContractFactory('NamespaceV1')
  const namespaceV1 = await NamespaceV1.deploy()

  await namespaceV1.deployed()

  console.log(`NamespaceV1 deployed to ${namespaceV1.address}`)

  // ConstraintsVerifier Contract Deployment
  const ConstraintsVerifier = await hre.ethers.getContractFactory(
    'ConstraintsVerifier',
  )
  const constraintsVerifier = await ConstraintsVerifier.deploy()

  await constraintsVerifier.deployed()

  console.log(`ConstraintsVerifier deployed to ${constraintsVerifier.address}`)

  // PricingOracleV1 Contract Deployment
  const PricingOracleV1 = await hre.ethers.getContractFactory('PricingOracleV1')
  const pricingOracleV1 = await PricingOracleV1.deploy(
    constraintsVerifier.address,
  )

  await pricingOracleV1.deployed()

  console.log(`PricingOracleV1 deployed to ${pricingOracleV1.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
