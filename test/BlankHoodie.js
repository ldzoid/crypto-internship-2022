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
            const { owner, hhBlankHoodie } = await loadFixture(deployContractFixture)

            await hhBlankHoodie.mint(1, { value: ethers.utils.parseEther('1') })
            expect(await hhBlankHoodie.balanceOf(owner.address)).to.equal(1)
        })
    })
})