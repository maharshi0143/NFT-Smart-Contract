const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NftCollection", function () {
  async function deployNftFixture() {
    const MAX_SUPPLY = 20;

    // Get the signers (accounts)
    const [owner, otherAccount, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const NftCollection = await ethers.getContractFactory("NftCollection");
    // Pass owner address and max supply to the constructor
    const nft = await NftCollection.deploy(owner.address, MAX_SUPPLY);
    await nft.waitForDeployment();

    return { nft, owner, otherAccount, addr1, addr2, MAX_SUPPLY };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { nft, owner } = await loadFixture(deployNftFixture);
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should set the correct max supply", async function () {
      const { nft, MAX_SUPPLY } = await loadFixture(deployNftFixture);
      expect(await nft.maxSupply()).to.equal(MAX_SUPPLY);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint", async function () {
      const { nft, owner, addr1 } = await loadFixture(deployNftFixture);
      const uri = "ipfs://test-uri";
      
      await nft.safeMint(addr1.address, uri);
      
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.ownerOf(0)).to.equal(addr1.address);
      expect(await nft.tokenURI(0)).to.equal(uri);
    });

    it("Should NOT allow non-owner to mint", async function () {
      const { nft, otherAccount, addr1 } = await loadFixture(deployNftFixture);
      const uri = "ipfs://test-uri";

      // We expect this transaction to be reverted with a specific error code from Ownable
      await expect(
        nft.connect(otherAccount).safeMint(addr1.address, uri)
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });

    it("Should NOT allow minting beyond max supply", async function () {
      // Create a fixture with a very small max supply for easy testing
      const smallSupply = 2;
      const [owner, addr1] = await ethers.getSigners();
      const NftCollection = await ethers.getContractFactory("NftCollection");
      const nft = await NftCollection.deploy(owner.address, smallSupply);
      await nft.waitForDeployment();

      // Mint 2 tokens (reaching the limit)
      await nft.safeMint(addr1.address, "uri1");
      await nft.safeMint(addr1.address, "uri2");

      // Attempt 3rd mint should fail
      await expect(
        nft.safeMint(addr1.address, "uri3")
      ).to.be.revertedWith("Max supply reached");
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const { nft, owner, addr1, addr2 } = await loadFixture(deployNftFixture);
      
      // Mint a token first
      await nft.safeMint(addr1.address, "uri");

      // Transfer from addr1 to addr2
      // We must connect as addr1 because addr1 owns the token
      await nft.connect(addr1).transferFrom(addr1.address, addr2.address, 0);

      expect(await nft.ownerOf(0)).to.equal(addr2.address);
      expect(await nft.balanceOf(addr1.address)).to.equal(0);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
    });
  });

  describe("Pausable", function () {
    it("Should allow owner to pause and unpause", async function () {
        const { nft, owner } = await loadFixture(deployNftFixture);
        
        await nft.pause();
        expect(await nft.paused()).to.equal(true);

        await nft.unpause();
        expect(await nft.paused()).to.equal(false);
    });

    it("Should prevent transfers when paused", async function () {
        const { nft, owner, addr1, addr2 } = await loadFixture(deployNftFixture);
        await nft.safeMint(addr1.address, "uri");

        await nft.pause();

        await expect(
            nft.connect(addr1).transferFrom(addr1.address, addr2.address, 0)
        ).to.be.revertedWithCustomError(nft, "EnforcedPause");
    });
  });
});