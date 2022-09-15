const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Staking contract', () => {
  describe('stake() functionality', () => {
    let user;
    let hhBlankHoodie, hhBlank, hhStaking;

    beforeEach(async () => {
      [owner, user] = await ethers.getSigners();
      const BlankHoodie = await ethers.getContractFactory('contracts/BlankHoodie.sol:BlankHoodie');
      const Blank = await ethers.getContractFactory('contracts/Blank.sol:Blank');
      const Staking = await ethers.getContractFactory('contracts/Staking.sol:Staking');
      hhBlankHoodie = await BlankHoodie.deploy();
      hhBlank = await Blank.deploy();
      hhStaking = await Staking.deploy(hhBlankHoodie.address, hhBlank.address);

      // unpause
      await hhBlankHoodie.setPaused(false);
      // mint 10 tokens each to owner and user
      await hhBlankHoodie.connect(user).mint(10, { value: ethers.utils.parseEther('1') });
      await hhBlankHoodie.mint(10, { value: ethers.utils.parseEther('1') });
      // approve staking contract
      await hhBlankHoodie.connect(user).setApprovalForAll(hhStaking.address, true);
      // send enough tokens to staking contract for rewards
      await hhBlank.transfer(hhStaking.address, ethers.utils.parseEther('1000'));
    });

    it('should transfer nft ownership to staking contract', async () => {
      await hhStaking.connect(user).stake([2, 3]);
      expect(await hhBlankHoodie.ownerOf(3)).to.equal(hhStaking.address);
    });

    it('should update all state variables properly', async () => {
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      timestampNow = block.timestamp;
      await hhStaking.connect(user).stake([0, 1, 5]);
      expect(await hhStaking.idToOwner(1)).to.equal(user.address);
      expect(await hhStaking.getStakesOfOwner(user.address)).deep.to.equal([0, 1, 5]);
      expect(await hhStaking.idToTimestamp(5)).to.be.at.least(timestampNow);
      expect(await hhStaking.idToTimestamp(5)).to.be.at.most(timestampNow + 3);
    });

    it('should revert if user not owner of NFTs', async () => {
      await expect(hhStaking.connect(user).stake([13, 14])).to.be.reverted;
    });
  });

  describe('unstake() functionality', () => {
    let user;
    let hhBlankHoodie, hhBlank, hhStaking;

    beforeEach(async () => {
      [owner, user] = await ethers.getSigners();
      const BlankHoodie = await ethers.getContractFactory('contracts/BlankHoodie.sol:BlankHoodie');
      const Blank = await ethers.getContractFactory('contracts/Blank.sol:Blank');
      const Staking = await ethers.getContractFactory('contracts/Staking.sol:Staking');
      hhBlankHoodie = await BlankHoodie.deploy();
      hhBlank = await Blank.deploy();
      hhStaking = await Staking.deploy(hhBlankHoodie.address, hhBlank.address);

      // unpause
      await hhBlankHoodie.setPaused(false);
      // mint 10 tokens each to owner and user
      await hhBlankHoodie.connect(user).mint(10, { value: ethers.utils.parseEther('1') });
      await hhBlankHoodie.mint(10, { value: ethers.utils.parseEther('1') });
      // approve staking contract
      await hhBlankHoodie.connect(user).setApprovalForAll(hhStaking.address, true);
      // send enough tokens to staking contract for rewards
      await hhBlank.transfer(hhStaking.address, ethers.utils.parseEther('1000'));
      // stake few NFTs
      await hhStaking.connect(user).stake([1, 3, 7, 8]);
    });

    it('should transfer back ownership to user', async () => {
      await hhStaking.connect(user).unstake([3, 7]);
      expect(await hhBlankHoodie.ownerOf(3)).to.equal(user.address);
    });

    it('should update state variables properly', async () => {
      await hhStaking.connect(user).unstake([7, 8]);
      expect(await hhStaking.idToOwner(7)).to.equal('0x0000000000000000000000000000000000000000');
      expect(await hhStaking.getStakesOfOwner(user.address)).deep.to.equal([1, 3]);
      expect(await hhStaking.idToTimestamp(8)).to.equal(0);
    });

    it('should reward user with tokens', async () => {
      await ethers.provider.send('evm_increaseTime', [86400]);
      await ethers.provider.send('evm_mine');
      await hhStaking.connect(user).unstake([1]);
      const balance = await hhBlank.balanceOf(user.address);
      expect(balance).to.be.at.least(ethers.utils.parseEther('9.99'));
      expect(balance).to.be.at.most(ethers.utils.parseEther('10.01'));
    });

    it('should revert if user not owner of NFTs', async () => {
      await expect(hhStaking.connect(user).unstake([9])).to.be.reverted;
    });
  });

  describe('claim() functionality', () => {
    let user;
    let hhBlankHoodie, hhBlank, hhStaking;
    let timestampNow;

    beforeEach(async () => {
      [owner, user] = await ethers.getSigners();
      const BlankHoodie = await ethers.getContractFactory('contracts/BlankHoodie.sol:BlankHoodie');
      const Blank = await ethers.getContractFactory('contracts/Blank.sol:Blank');
      const Staking = await ethers.getContractFactory('contracts/Staking.sol:Staking');
      hhBlankHoodie = await BlankHoodie.deploy();
      hhBlank = await Blank.deploy();
      hhStaking = await Staking.deploy(hhBlankHoodie.address, hhBlank.address);

      // unpause
      await hhBlankHoodie.setPaused(false);
      // mint 10 tokens each to owner and user
      await hhBlankHoodie.connect(user).mint(10, { value: ethers.utils.parseEther('1') });
      await hhBlankHoodie.mint(10, { value: ethers.utils.parseEther('1') });
      // approve staking contract
      await hhBlankHoodie.connect(user).setApprovalForAll(hhStaking.address, true);
      // send enough tokens to staking contract for rewards
      await hhBlank.transfer(hhStaking.address, ethers.utils.parseEther('1000'));
      // stake few NFTs
      await hhStaking.connect(user).stake([1, 3, 7, 8]);
      // simulate time passing (2 days)
      await ethers.provider.send('evm_increaseTime', [172800]);
      await ethers.provider.send('evm_mine');
      const blockNumAfter = await ethers.provider.getBlockNumber();
      const blockAfter = await ethers.provider.getBlock(blockNumAfter);
      timestampNow = blockAfter.timestamp;
    });

    it('should update state variables properly', async () => {
      await hhStaking.connect(user).claim();
      expect(await hhStaking.idToTimestamp(3)).to.be.at.least(timestampNow);
      expect(await hhStaking.idToTimestamp(3)).to.be.at.most(timestampNow + 5);
    });

    it('should transfer right amount of tokens', async () => {
      await hhStaking.connect(user).claim(); // 2 days * 4 stakes = 80 tokens
      expect(await hhBlank.balanceOf(user.address)).to.be.at.least(ethers.utils.parseEther('79.9'));
      expect(await hhBlank.balanceOf(user.address)).to.be.at.most(ethers.utils.parseEther('80.1'));
    });
  });

  describe('getReward() functionality', () => {
    let user;
    let hhBlankHoodie, hhBlank, hhStaking;

    beforeEach(async () => {
      [owner, user] = await ethers.getSigners();
      const BlankHoodie = await ethers.getContractFactory('contracts/BlankHoodie.sol:BlankHoodie');
      const Blank = await ethers.getContractFactory('contracts/Blank.sol:Blank');
      const Staking = await ethers.getContractFactory('contracts/Staking.sol:Staking');
      hhBlankHoodie = await BlankHoodie.deploy();
      hhBlank = await Blank.deploy();
      hhStaking = await Staking.deploy(hhBlankHoodie.address, hhBlank.address);

      // unpause
      await hhBlankHoodie.setPaused(false);
      // mint 10 tokens each to owner and user
      await hhBlankHoodie.connect(user).mint(10, { value: ethers.utils.parseEther('1') });
      await hhBlankHoodie.mint(10, { value: ethers.utils.parseEther('1') });
      // approve staking contract
      await hhBlankHoodie.connect(user).setApprovalForAll(hhStaking.address, true);
      // send enough tokens to staking contract for rewards
      await hhBlank.transfer(hhStaking.address, ethers.utils.parseEther('1000'));
      // stake few NFTs
      await hhStaking.connect(user).stake([1, 3, 7, 8]);
    });

    it('should return correct reward for staked NFTs', async () => {
      await ethers.provider.send('evm_increaseTime', [86400]); // 1 day => 10 tokens
      await ethers.provider.send('evm_mine');
      expect(await hhStaking.getReward(1)).to.be.at.least(ethers.utils.parseEther('9.99'));
      expect(await hhStaking.getReward(3)).to.be.at.most(ethers.utils.parseEther('10.01'));
    });

    it('should return 0 for unstaked NFTs', async () => {
      expect(await hhStaking.getReward(5)).to.equal(0);
    });
  });

  describe('getRewardsOfOwner()', () => {
    let user, user2;
    let hhBlankHoodie, hhBlank, hhStaking;

    beforeEach(async () => {
      [owner, user, user2] = await ethers.getSigners();
      const BlankHoodie = await ethers.getContractFactory('contracts/BlankHoodie.sol:BlankHoodie');
      const Blank = await ethers.getContractFactory('contracts/Blank.sol:Blank');
      const Staking = await ethers.getContractFactory('contracts/Staking.sol:Staking');
      hhBlankHoodie = await BlankHoodie.deploy();
      hhBlank = await Blank.deploy();
      hhStaking = await Staking.deploy(hhBlankHoodie.address, hhBlank.address);

      // unpause
      await hhBlankHoodie.setPaused(false);
      // mint 10 tokens each to owner and user
      await hhBlankHoodie.connect(user).mint(10, { value: ethers.utils.parseEther('1') });
      await hhBlankHoodie.mint(10, { value: ethers.utils.parseEther('1') });
      // approve staking contract
      await hhBlankHoodie.connect(user).setApprovalForAll(hhStaking.address, true);
      // send enough tokens to staking contract for rewards
      await hhBlank.transfer(hhStaking.address, ethers.utils.parseEther('1000'));
      // stake few NFTs
      await hhStaking.connect(user).stake([1, 3, 7, 8]);
    });

    it('should return correct total reward for address', async () => {
      // simulate time passing => 1 day
      await ethers.provider.send('evm_increaseTime', [86400]);
      await ethers.provider.send('evm_mine');
      // reward should be 1 day * 10 tokensPerDay * 4 NFTs = 40 tokens
      expect(await hhStaking.getRewardsOfOwner(user.address)).to.be.at.least(
        ethers.utils.parseEther('39.9')
      );
      expect(await hhStaking.getRewardsOfOwner(user.address)).to.be.at.most(
        ethers.utils.parseEther('40.01')
      );
    });

    it('should return 0 for address with 0 staked NFTs', async () => {
      expect(await hhStaking.getRewardsOfOwner(user2.address)).to.equal(0);
    });
  });

  describe('emergencyUnstake() functionality', () => {
    let owner, user;
    let hhBlankHoodie, hhBlank, hhStaking;

    beforeEach(async () => {
      [owner, user] = await ethers.getSigners();
      const BlankHoodie = await ethers.getContractFactory('contracts/BlankHoodie.sol:BlankHoodie');
      const Blank = await ethers.getContractFactory('contracts/Blank.sol:Blank');
      const Staking = await ethers.getContractFactory('contracts/Staking.sol:Staking');
      hhBlankHoodie = await BlankHoodie.deploy();
      hhBlank = await Blank.deploy();
      hhStaking = await Staking.deploy(hhBlankHoodie.address, hhBlank.address);

      // unpause
      await hhBlankHoodie.setPaused(false);
      // mint 10 tokens each to owner and user
      await hhBlankHoodie.connect(user).mint(10, { value: ethers.utils.parseEther('1') });
      await hhBlankHoodie.mint(10, { value: ethers.utils.parseEther('1') });
      // approve staking contract
      await hhBlankHoodie.connect(user).setApprovalForAll(hhStaking.address, true);
      // send enough tokens to staking contract for rewards
      await hhBlank.transfer(hhStaking.address, ethers.utils.parseEther('1000'));
      // stake few NFTs
      await hhStaking.connect(user).stake([1, 3, 7, 8]);
      // emergency unstake couple of tokens
      await hhStaking.emergencyUnstake(3);
      await hhStaking.emergencyUnstake(8);
    });

    it('should transfer NFT to contract owner', async () => {
      expect(await hhBlankHoodie.ownerOf(3)).to.equal(owner.address);
    });

    it('should update state variables properly', async () => {
      expect(await hhStaking.idToOwner(8)).to.equal('0x0000000000000000000000000000000000000000');
      expect(await hhStaking.idToTimestamp(3)).to.equal(0);
      expect(await hhStaking.getStakesOfOwner(user.address)).deep.to.equal([1, 7]);
    });

    it('should revert if caller not the owner', async () => {
      await expect(hhStaking.connect(user).emergencyUnstake(7)).to.be.reverted;
    });
  });

  describe('pause() functionality', () => {
    it('should set contract paused', async () => {
      const BlankHoodie = await ethers.getContractFactory('contracts/BlankHoodie.sol:BlankHoodie');
      const Blank = await ethers.getContractFactory('contracts/Blank.sol:Blank');
      const Staking = await ethers.getContractFactory('contracts/Staking.sol:Staking');
      const hhBlankHoodie = await BlankHoodie.deploy();
      const hhBlank = await Blank.deploy();
      const hhStaking = await Staking.deploy(hhBlankHoodie.address, hhBlank.address);
      // pause contract
      await hhStaking.pause();
      expect(await hhStaking.paused()).to.equal(true);
    });
  });

  describe('unpause() functionality', () => {
    it('should set contract unpaused', async () => {
      const BlankHoodie = await ethers.getContractFactory('contracts/BlankHoodie.sol:BlankHoodie');
      const Blank = await ethers.getContractFactory('contracts/Blank.sol:Blank');
      const Staking = await ethers.getContractFactory('contracts/Staking.sol:Staking');
      const hhBlankHoodie = await BlankHoodie.deploy();
      const hhBlank = await Blank.deploy();
      const hhStaking = await Staking.deploy(hhBlankHoodie.address, hhBlank.address);
      // pause contract
      await hhStaking.pause();
      // unpause contract
      await hhStaking.unpause();
      expect(await hhStaking.paused()).to.equal(false);
    });
  });
});
