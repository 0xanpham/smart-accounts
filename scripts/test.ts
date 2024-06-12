import hre from "hardhat";

const EP_ADDR = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
const ACCOUNT_ADDR = "0x75537828f2ce51be7289709686A69CbFDbB714F1";

async function main() {
  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
  const count = await account.count();
  console.log(count);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})