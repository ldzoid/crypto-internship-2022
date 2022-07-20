const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('BlankHoodie contract', () => {

    const deployContractFixture = async () => {
        const [owner, addr1, addr2] = await ethers.getSigners()
        const BlankHoodie = await ethers.getContractFactory('BlankHoodie')
        const hhBlankHoodie = await BlankHoodie.deploy()
        await hhBlankHoodie.setPaused(false)
        await hhBlankHoodie.deployed()

        return { BlankHoodie, hhBlankHoodie, owner, addr1, addr2 }
    }

    describe('mint() function', () => {

        it('user should be able to mint with enough ether', async () => {
            const { owner, addr1, hhBlankHoodie } = await loadFixture(deployContractFixture)
            
            // increase in balance after mint
            await hhBlankHoodie.connect(addr1).mint(1, { value: ethers.utils.parseEther('0.1') })
            expect(await hhBlankHoodie.balanceOf(addr1.address)).to.equal(1)

            await hhBlankHoodie.mint(3, { value: ethers.utils.parseEther('0.3') })
            expect(await hhBlankHoodie.balanceOf(owner.address)).to.equal(3)

            // token IDs should match in order
            expect(await hhBlankHoodie.ownerOf(0)).to.equal(addr1.address)
            expect(await hhBlankHoodie.ownerOf(1)).to.equal(owner.address)
            expect(await hhBlankHoodie.ownerOf(3)).to.equal(owner.address)
        })

        it('tx should revert if user tries to mint without enough ether', async () => {
            const { owner, addr1, hhBlankHoodie } = await loadFixture(deployContractFixture)

            // tx should revert
            await expect(hhBlankHoodie.connect(addr1).mint(1, { value: ethers.utils.parseEther('0.08') })).to.be.revertedWith('Insufficient funds!');
            await expect(hhBlankHoodie.connect(addr1).mint(2)).to.be.revertedWith('Insufficient funds!')

            // balance should remain 0
            expect(await hhBlankHoodie.balanceOf(addr1.address)).to.equal(0)
        })
    })

    describe('tokenURI() function', () => {

        it('should return valid URI on existent tokens', async () => {
            const { owner, addr1, hhBlankHoodie } = await loadFixture(deployContractFixture)

            // mint 2 NFTs and set base URI
            await hhBlankHoodie.mint(2, { value: ethers.utils.parseEther('0.2') })

            // check tokenURI()
            expect(await hhBlankHoodie.tokenURI(1)).to.equal('ipfs://QmVqodXFfpUU13GJDetcE2UtPLWMBsZubX6ZnhU3XDWhmJ')
        })

        it('tx should revert if calls tokenURI() for not minted token', async () => {
            const { owner, addr1, hhBlankHoodie } = await loadFixture(deployContractFixture)

            await expect(hhBlankHoodie.tokenURI(0)).to.be.revertedWith('ERC721Metadata: URI query for nonexistent token')
        })
    })
})