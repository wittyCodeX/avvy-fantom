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
  const NamespaceV1 = await hre.ethers.getContractFactory('NamespaceV1')
  const namespaceV1 = await NamespaceV1.deploy(owner.address)

  await namespaceV1.deployed()

  console.log(`NamespaceV1 deployed to ${namespaceV1.address}`)

  // PricingOracleV1 Contract Deployment
  const PricingOracleV1 = await hre.ethers.getContractFactory('PricingOracleV1')
  const pricingOracleV1 = await PricingOracleV1.deploy(owner.address)

  await pricingOracleV1.deployed()

  console.log(`PricingOracleV1 deployed to ${pricingOracleV1.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
