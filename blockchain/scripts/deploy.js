async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log('Deploying contracts with the account:', deployer.address);
  
    console.log('Account balance:', (await deployer.getBalance()).toString());
  
    const contract = await ethers.getContractFactory('Blank');
    const hhContract = await contract.deploy();
  
    console.log('Contract address:', hhContract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
  