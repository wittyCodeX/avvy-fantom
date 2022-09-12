// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat')

async function main() {
  const [owner] = await ethers.getSigners()

  // ConstraintsFNSV1 Contract Deployment
  const ConstraintsFNSV1 = await hre.ethers.getContractFactory(
    'ConstraintsFNSV1',
  )
  const constraintsFNSV1 = await ConstraintsFNSV1.deploy(
    '0x2116B4FfD4048208a7e1b094582f8e32e090a888',
  )

  await constraintsFNSV1
  console.log(`ConstraintsFNSV1 deployed to ${constraintsFNSV1.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
