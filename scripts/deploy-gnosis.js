// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { poseidonContract } = require('circomlibjs')
const hre = require('hardhat')

async function main() {
  // ContractRegistryV1 Contract Deployment
  const GnosisSafe = await hre.ethers.getContractFactory('GnosisSafe')
  const gnosisSafe = await GnosisSafe.deploy()

  await gnosisSafe.deployed()

  console.log(`GnosisSafe deployed to ${gnosisSafe.address}`)

  // // ContractRegistryV1 Contract Deployment
  // const GnosisSafeL2 = await hre.ethers.getContractFactory('GnosisSafeL2')
  // const gnosisSafeL2 = await GnosisSafeL2.deploy()

  // await gnosisSafeL2.deployed()

  // console.log(`GnosisSafeL2 deployed to ${gnosisSafeL2.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

/**
 *
 *
 */
