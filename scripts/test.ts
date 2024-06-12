import hre from "hardhat";

const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ACCOUNT_ADDR = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";
const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  // const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
  // const count = await account.count();
  // console.log(count);
  // const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);
  // console.log(await entryPoint.getDeployedCode())
  console.log("account balance", await hre.ethers.provider.getBalance(ACCOUNT_ADDR));
  console.log("paymaster balance", await hre.ethers.provider.getBalance(PM_ADDRESS));
  console.log("entrypoint balance", await hre.ethers.provider.getBalance(EP_ADDRESS));
  const ep = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
  console.log("account balance on EP", await ep.balanceOf(ACCOUNT_ADDR));
  console.log("paymaster balance on EP", await ep.balanceOf(PM_ADDRESS));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})