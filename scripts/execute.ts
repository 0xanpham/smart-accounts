import hre from "hardhat";

interface IUserOp {
  sender: string;
  nonce: any;
  initCode: string;
  callData: any;
  callGasLimit: number;
  verificationGasLimit: number;
  preVerificationGas: number;
  maxFeePerGas: any;
  maxPriorityFeePerGas: any;
  paymasterAndData: string;
  signature: string;
}

const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  const sender = await hre.ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE,
  })

  // Get contract factory of AccountFactory contract (ABI) and encode the function in order to append it to init code (20 first bytes is factory contract address and remaining bytes is call data encoded)
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();
  // Slice 2 to remove the first 2 characters 0x from encode function data
  // const initCode = "0x";
  const initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);

  console.log({ sender })

  // Related to error AA21 in entry point contract
  await entryPoint.depositTo(PM_ADDRESS, {
    value: hre.ethers.parseEther("100")
  })
  
  const Account = await hre.ethers.getContractFactory("Account");

  const userOp: IUserOp = {
    sender, // smart account address
    nonce: await entryPoint.getNonce(sender, 0), // nonce which entry point contract manage
    initCode,
    callData: Account.interface.encodeFunctionData("execute"), // encoded function to call inside smart account contract
    callGasLimit: 200_000,
    verificationGasLimit: 200_000,
    preVerificationGas: 50_000,
    maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
    paymasterAndData: PM_ADDRESS,
    signature: "0x"
  }

  console.log({ userOp })

  const tx = await entryPoint.handleOps([userOp], address0);
  const receipt = await tx.wait();
  console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})