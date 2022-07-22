// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre, { ethers } from 'hardhat';

async function main() {
  const accounts = await ethers.getSigners();

  console.log('Running deploy script');

  const SPACE_TOKEN = await ethers.getContractFactory('SpaceToken', {
    signer: accounts[0],
  });

  const spaceToken = await SPACE_TOKEN.deploy('ETHERREUM', 'ETH');
  await spaceToken.deployed();

  const CHARITY_DAPP = await ethers.getContractFactory('Charity', {
    signer: accounts[0],
  });

  const charity = await CHARITY_DAPP.deploy(
    86400, // Current time + 1 Day
    '0xFE3E99a79a22378F1Aca8A9b39414aEC87079E9C',
    spaceToken.address,
  );
  await charity.deployed();

  await charity.deployed();
  console.log('Charity deployed to:', charity.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
