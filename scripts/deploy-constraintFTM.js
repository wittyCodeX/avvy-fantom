// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat')

async function main() {
  const [owner] = await ethers.getSigners()

  // ConstraintsFTMV1 Contract Deployment
  const ConstraintsFTMV1 = await hre.ethers.getContractFactory(
    'ConstraintsFTMV1',
  )
  const constraintsFTMV1 = await ConstraintsFTMV1.deploy(
    '0x2116B4FfD4048208a7e1b094582f8e32e090a888',
  )

  await constraintsFTMV1
  console.log(`ConstraintsFTMV1 deployed to ${constraintsFTMV1.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
