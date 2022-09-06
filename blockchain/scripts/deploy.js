async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log('Deploying contracts with the account:', deployer.address);
  
    console.log('Account balance:', (await deployer.getBalance()).toString());
  
    const contract = await ethers.getContractFactory('Staking');
    const hhContract = await contract.deploy('0xf63f410b7831AA6b34651260C8d5B69F812581b3', '0xe34Ae383eB86eDcA4d4E381C5440b544b13EBFBf');
  
    console.log('Contract address:', hhContract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
  