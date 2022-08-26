const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Blank contract', async () => {
  let owner;
  let hhBlank = null;

  beforeEach(async () => {
    owner = await ethers.getSigner();
    const Blank = await ethers.getContractFactory('Blank');
    hhBlank = await Blank.deploy();

    await hhBlank.deployed();
  });

  it('should set name properly', async () => {
    expect(await hhBlank.name()).to.equal('Blank');
  });

  it('should set symbol properly', async () => {
    expect(await hhBlank.symbol()).to.equal('BLANK');
  });

  it('should set maximum cap properly', async () => {
    expect(parseInt(ethers.utils.formatEther(await hhBlank.cap()))).to.equal(
      1000000
    );
  });

  it('should mint initial tokens to deployer address', async () => {
    expect(
      parseInt(ethers.utils.formatEther(await hhBlank.balanceOf(owner.address)))
    ).to.equal(1000000);
  });
});
