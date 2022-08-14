async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const BlankHoodie = await ethers.getContractFactory("BlankHoodie");
    const hhBlankHoodie = await BlankHoodie.deploy();
  
    console.log("Contract address:", hhBlankHoodie.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  