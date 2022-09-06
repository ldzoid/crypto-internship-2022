const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('BlankHoodie contract', () => {
  describe('mint() functionality', () => {
    let owner, user;
    let hhBlankHoodie = null;

    beforeEach(async () => {
      [owner, user] = await ethers.getSigners();
      const BlankHoodie = await ethers.getContractFactory(
        'contracts/BlankHoodie.sol:BlankHoodie'
      );
      hhBlankHoodie = await BlankHoodie.deploy();

      await hhBlankHoodie.setPaused(false);
    });

    it('user should be able to mint with enough ether', async () => {
      // increase in balance after mint
      await hhBlankHoodie
        .connect(user)
        .mint(1, { value: ethers.utils.parseEther('0.1') });
      expect(await hhBlankHoodie.balanceOf(user.address)).to.equal(1);

      await hhBlankHoodie.mint(3, { value: ethers.utils.parseEther('0.3') });
      expect(await hhBlankHoodie.balanceOf(owner.address)).to.equal(3);

      // token IDs should match in order
      expect(await hhBlankHoodie.ownerOf(0)).to.equal(user.address);
      expect(await hhBlankHoodie.ownerOf(1)).to.equal(owner.address);
      expect(await hhBlankHoodie.ownerOf(3)).to.equal(owner.address);
    });

    it('should revert if user tries to mint without enough ether', async () => {
      // tx should revert
      await expect(
        hhBlankHoodie
          .connect(user)
          .mint(1, { value: ethers.utils.parseEther('0.08') })
      ).to.be.reverted;
      await expect(hhBlankHoodie.connect(user).mint(2)).to.be.reverted;

      // balance should remain 0
      expect(await hhBlankHoodie.balanceOf(user.address)).to.equal(0);
    });

    it('should revert if max supply is exceeded', async () => {
      // mint all NFTs so that max supply is reached
      await hhBlankHoodie.mint(500, { value: ethers.utils.parseEther('50') });

      // should revert if tries to mint another
      await expect(
        hhBlankHoodie
          .connect(user)
          .mint(1, { value: ethers.utils.parseEther('0.1') })
      ).to.be.reverted;
    });
  });

  describe('airDrop() functionality', () => {
    let owner, user;
    let hhBlankHoodie = null;

    beforeEach(async () => {
      [owner, user] = await ethers.getSigners();
      const BlankHoodie = await ethers.getContractFactory(
        'contracts/BlankHoodie.sol:BlankHoodie'
      );
      hhBlankHoodie = await BlankHoodie.deploy();

      await hhBlankHoodie.setPaused(false);
    });

    it('owner should be able to mint anyone for free', async () => {
      // airdrop to some address
      await hhBlankHoodie.airDrop(owner.address, 1);
      await hhBlankHoodie.airDrop(user.address, 3);

      // check balances
      expect(await hhBlankHoodie.balanceOf(owner.address)).to.equal(1);
      expect(await hhBlankHoodie.balanceOf(user.address)).to.equal(3);
    });

    it('should revert if caller not the owner', async () => {
      // tx should revert if caller not owner
      await expect(
        hhBlankHoodie.connect(user).airDrop(owner.address, 2)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should revert if max supply is exceeded', async () => {
      // mint all NFTs to reach max supply
      await hhBlankHoodie.mint(500, { value: ethers.utils.parseEther('50') });
      // should revert if mint another one
      await expect(hhBlankHoodie.airDrop(user.address, 4)).to.be.reverted;
    });
  });

  describe('tokenURI() functionality', () => {
    let owner, user;
    let hhBlankHoodie = null;

    beforeEach(async () => {
      [owner, user] = await ethers.getSigners();
      const BlankHoodie = await ethers.getContractFactory(
        'contracts/BlankHoodie.sol:BlankHoodie'
      );
      hhBlankHoodie = await BlankHoodie.deploy();

      await hhBlankHoodie.setPaused(false);
    });

    it('should return valid URI for minted tokens', async () => {
      // mint 2 NFTs and set base URI
      await hhBlankHoodie.mint(2, { value: ethers.utils.parseEther('0.2') });

      // check tokenURI()
      expect(await hhBlankHoodie.tokenURI(1)).to.equal(
        'ipfs://QmVqodXFfpUU13GJDetcE2UtPLWMBsZubX6ZnhU3XDWhmJ'
      );
    });

    it('should revert if calls tokenURI() for not minted token', async () => {
      await expect(hhBlankHoodie.tokenURI(0)).to.be.revertedWith(
        'ERC721Metadata: URI query for nonexistent token'
      );
    });
  });

  describe('setBaseURI() functionality', () => {
    let owner, user;
    let hhBlankHoodie = null;

    beforeEach(async () => {
      [owner, user] = await ethers.getSigners();
      const BlankHoodie = await ethers.getContractFactory(
        'contracts/BlankHoodie.sol:BlankHoodie'
      );
      hhBlankHoodie = await BlankHoodie.deploy();

      await hhBlankHoodie.setPaused(false);
    });

    it('owner should be able to update base URI anytime', async () => {
      // update URI
      await hhBlankHoodie.setBaseURI('new URI');

      // mint & check token URI
      await hhBlankHoodie.airDrop(owner.address, 1);
      expect(await hhBlankHoodie.tokenURI(0)).to.equal('new URI');
    });

    it('should revert if caller not the owner', async () => {
      expect(
        hhBlankHoodie.connect(user).setBaseURI('some-new-URI')
      ).to.be.revertedWith('Ownable: Caller not the owner');
    });
  });

  describe('setPaused() functionality', () => {
    let owner, user;
    let hhBlankHoodie = null;

    beforeEach(async () => {
      [owner, user] = await ethers.getSigners();
      const BlankHoodie = await ethers.getContractFactory(
        'contracts/BlankHoodie.sol:BlankHoodie'
      );
      hhBlankHoodie = await BlankHoodie.deploy();

      await hhBlankHoodie.setPaused(false);
    });

    it('pause/unpause minting', async () => {
      // pause
      await hhBlankHoodie.setPaused(true);
      // should revert when minting
      await expect(
        hhBlankHoodie.mint(2, { value: ethers.utils.parseEther('0.2') })
      ).to.be.reverted;

      // unpause
      await hhBlankHoodie.setPaused(false);
      // minting should work
      await expect(
        hhBlankHoodie.mint(2, { value: ethers.utils.parseEther('0.2') })
      ).to.not.be.reverted;
    });

    it('should revert if caller not the owner', async () => {
      await expect(
        hhBlankHoodie.connect(user).setPaused(true)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('setCost() functionality', () => {
    let owner, user;
    let hhBlankHoodie = null;

    beforeEach(async () => {
      [owner, user] = await ethers.getSigners();
      const BlankHoodie = await ethers.getContractFactory(
        'contracts/BlankHoodie.sol:BlankHoodie'
      );
      hhBlankHoodie = await BlankHoodie.deploy();

      await hhBlankHoodie.setPaused(false);
    });

    it('should change cost accordingly if called by owner', async () => {
      // change cost
      await hhBlankHoodie.setCost(ethers.utils.parseEther('1'));
      // minting on previous price should revert
      await expect(
        hhBlankHoodie
          .connect(user)
          .mint(1, { value: ethers.utils.parseEther('0.1') })
      ).to.be.reverted;
      // minting on new price should work
      await expect(
        hhBlankHoodie
          .connect(user)
          .mint(1, { value: ethers.utils.parseEther('1') })
      ).to.not.be.reverted;
    });

    it('should revert if caller not the owner', async () => {
      await expect(
        hhBlankHoodie.connect(user).setCost(ethers.utils.parseEther('1'))
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('withdraw() functionality', () => {
    let owner, user;
    let hhBlankHoodie = null;

    beforeEach(async () => {
      [owner, user] = await ethers.getSigners();
      const BlankHoodie = await ethers.getContractFactory(
        'contracts/BlankHoodie.sol:BlankHoodie'
      );
      hhBlankHoodie = await BlankHoodie.deploy();

      await hhBlankHoodie.setPaused(false);
    });

    it('should transfer contract balance to owner if called by owner', async () => {
      // mint NFTs to send ether to contract
      await hhBlankHoodie
        .connect(user)
        .mint(5, { value: ethers.utils.parseEther('0.5') });

      // withdraw money and check if ether is transfered to owner
      expect(await hhBlankHoodie.withdraw()).to.changeEtherBalance(
        owner,
        ethers.utils.parseEther('0.5')
      );
    });

    it('should revert if caller not the owner', async () => {
      await expect(hhBlankHoodie.connect(user).withdraw()).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });
  });
});
