// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { poseidonContract } = require('circomlibjs')
const hre = require('hardhat')

async function main() {
  const poseidonABI = poseidonContract.generateABI(3)
  const poseidonCode = poseidonContract.createCode(3)

  const [signer] = await ethers.getSigners()

  const PoseidonFactory = new ethers.ContractFactory(
    poseidonABI,
    poseidonCode,
    signer,
  )
  const PoseidonContract = await PoseidonFactory.deploy()

  await PoseidonContract.deployed()
  console.log(`PoseidonContract deployed to ${PoseidonContract.address}`)
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
