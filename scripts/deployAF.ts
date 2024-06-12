import hre from "hardhat";

async function main() {
  const af = await hre.ethers.deployContract("AccountFactory");

  await af.waitForDeployment();

  console.log(`EP deployed to ${af.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})