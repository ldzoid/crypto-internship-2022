const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlankHoodie contract", () => {
  // fixture for basic ready-to-use contract environment
  const deployContractFixture = async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const BlankHoodie = await ethers.getContractFactory("BlankHoodie");
    const hhBlankHoodie = await BlankHoodie.deploy();

    await hhBlankHoodie.setPaused(false);
    await hhBlankHoodie.deployed();

    return { BlankHoodie, hhBlankHoodie, owner, addr1, addr2 };
  };

  describe("mint() functionality", () => {
    it("user should be able to mint with enough ether", async () => {
      const { owner, addr1, hhBlankHoodie } = await loadFixture(
        deployContractFixture
      );

      // increase in balance after mint
      await hhBlankHoodie
        .connect(addr1)
        .mint(1, { value: ethers.utils.parseEther("0.1") });
      expect(await hhBlankHoodie.balanceOf(addr1.address)).to.equal(1);

      await hhBlankHoodie.mint(3, { value: ethers.utils.parseEther("0.3") });
      expect(await hhBlankHoodie.balanceOf(owner.address)).to.equal(3);

      // token IDs should match in order
      expect(await hhBlankHoodie.ownerOf(0)).to.equal(addr1.address);
      expect(await hhBlankHoodie.ownerOf(1)).to.equal(owner.address);
      expect(await hhBlankHoodie.ownerOf(3)).to.equal(owner.address);
    });

    it("should revert if user tries to mint without enough ether", async () => {
      const { addr1, hhBlankHoodie } = await loadFixture(deployContractFixture);

      // tx should revert
      await expect(
        hhBlankHoodie
          .connect(addr1)
          .mint(1, { value: ethers.utils.parseEther("0.08") })
      ).to.be.revertedWith("Insufficient funds!");
      await expect(hhBlankHoodie.connect(addr1).mint(2)).to.be.revertedWith(
        "Insufficient funds!"
      );

      // balance should remain 0
      expect(await hhBlankHoodie.balanceOf(addr1.address)).to.equal(0);
    });

    it("should revert if max supply is exceeded", async () => {
      const { addr1, hhBlankHoodie } = await loadFixture(deployContractFixture);

      // mint all NFTs so that max supply is reached
      await hhBlankHoodie.mint(500, { value: ethers.utils.parseEther("50") });

      // should revert if tries to mint another
      await expect(
        hhBlankHoodie
          .connect(addr1)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      ).to.be.revertedWith("Max supply exceeded!");
    });
  });

  describe("airDrop() functionality", () => {
    it("owner should be able to mint anyone for free", async () => {
      const { addr1, addr2, hhBlankHoodie } = await loadFixture(
        deployContractFixture
      );

      // airdrop to some address
      await hhBlankHoodie.airDrop(addr1.address, 1);
      await hhBlankHoodie.airDrop(addr2.address, 3);

      // check balances
      expect(await hhBlankHoodie.balanceOf(addr1.address)).to.equal(1);
      expect(await hhBlankHoodie.balanceOf(addr2.address)).to.equal(3);
    });

    it("should revert if caller not the owner", async () => {
      const { addr1, addr2, hhBlankHoodie } = await loadFixture(
        deployContractFixture
      );

      // tx should revert if caller not owner
      await expect(
        hhBlankHoodie.connect(addr1).airDrop(addr2.address, 2)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should revert if max supply is exceeded", async () => {
      const { addr1, hhBlankHoodie } = await loadFixture(deployContractFixture);

      // mint all NFTs to reach max supply
      await hhBlankHoodie.mint(500, { value: ethers.utils.parseEther("50") });
      // should revert if mint another one
      await expect(hhBlankHoodie.airDrop(addr1.address, 4)).to.be.revertedWith(
        "Max supply exceeded!"
      );
    });
  });

  describe("tokenURI() functionality", () => {
    it("should return valid URI for minted tokens", async () => {
      const { hhBlankHoodie } = await loadFixture(deployContractFixture);

      // mint 2 NFTs and set base URI
      await hhBlankHoodie.mint(2, { value: ethers.utils.parseEther("0.2") });

      // check tokenURI()
      expect(await hhBlankHoodie.tokenURI(1)).to.equal(
        "ipfs://QmVqodXFfpUU13GJDetcE2UtPLWMBsZubX6ZnhU3XDWhmJ"
      );
    });

    it("should revert if calls tokenURI() for not minted token", async () => {
      const { hhBlankHoodie } = await loadFixture(deployContractFixture);

      await expect(hhBlankHoodie.tokenURI(0)).to.be.revertedWith(
        "ERC721Metadata: URI query for nonexistent token"
      );
    });
  });

  describe("setBaseURI() functionality", () => {
    it("owner should be able to update base URI anytime", async () => {
      const { owner, hhBlankHoodie } = await loadFixture(deployContractFixture);

      // update URI
      await hhBlankHoodie.setBaseURI("new URI");

      // mint & check token URI
      await hhBlankHoodie.airDrop(owner.address, 1);
      expect(await hhBlankHoodie.tokenURI(0)).to.equal("new URI");
    });

    it("should revert if caller not the owner", async () => {
      const { addr1, hhBlankHoodie } = await loadFixture(deployContractFixture);

      expect(
        hhBlankHoodie.connect(addr1).setBaseURI("some-new-URI")
      ).to.be.revertedWith("Ownable: Caller not the owner");
    });
  });

  describe("setPaused() functionality", () => {
    it("pause/unpause minting", async () => {
      const { hhBlankHoodie } = await loadFixture(deployContractFixture);

      // pause
      await hhBlankHoodie.setPaused(true);
      // should revert when minting
      await expect(
        hhBlankHoodie.mint(2, { value: ethers.utils.parseEther("0.2") })
      ).to.be.revertedWith("Contract is paused!");

      // unpause
      await hhBlankHoodie.setPaused(false);
      // minting should work
      await expect(
        hhBlankHoodie.mint(2, { value: ethers.utils.parseEther("0.2") })
      ).to.not.be.reverted;
    });

    it("should revert if caller not the owner", async () => {
      const { addr1, hhBlankHoodie } = await loadFixture(deployContractFixture);

      await expect(
        hhBlankHoodie.connect(addr1).setPaused(true)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("setCost() functionality", () => {
    it("should change cost accordingly if called by owner", async () => {
      const { addr1, hhBlankHoodie } = await loadFixture(deployContractFixture);

      // change cost
      await hhBlankHoodie.setCost(ethers.utils.parseEther("1"));
      // minting on previous price should revert
      await expect(
        hhBlankHoodie
          .connect(addr1)
          .mint(1, { value: ethers.utils.parseEther("0.1") })
      ).to.be.revertedWith("Insufficient funds!");
      // minting on new price should work
      await expect(
        hhBlankHoodie
          .connect(addr1)
          .mint(1, { value: ethers.utils.parseEther("1") })
      ).to.not.be.reverted;
    });

    it("should revert if caller not the owner", async () => {
      const { addr1, hhBlankHoodie } = await loadFixture(deployContractFixture);

      await expect(
        hhBlankHoodie.connect(addr1).setCost(ethers.utils.parseEther("1"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("withdraw() functionality", () => {
    it("should transfer contract balance to owner if called by owner", async () => {
      const { owner, addr1, hhBlankHoodie } = await loadFixture(
        deployContractFixture
      );

      // mint NFTs to send ether to contract
      await hhBlankHoodie
        .connect(addr1)
        .mint(5, { value: ethers.utils.parseEther("0.5") });

      // withdraw money and check if ether is transfered to owner
      expect(await hhBlankHoodie.withdraw()).to.changeEtherBalance(
        owner,
        ethers.utils.parseEther("0.5")
      );
    });

    it("should revert if caller not the owner", async () => {
      const { addr1, hhBlankHoodie } = await loadFixture(deployContractFixture);

      await expect(hhBlankHoodie.connect(addr1).withdraw()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });
});
