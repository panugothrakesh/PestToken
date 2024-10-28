const { expect } = require("chai");
const hre = require("hardhat");

describe("PestToken contract", function() {
  // global vars
  let Token;
  let pestToken;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 40000000;
  let tokenBlockReward = 50;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("PestToken");
    [owner, addr1, addr2] = await hre.ethers.getSigners();
    pestToken = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
        console.log("PestOwner : ", pestToken.owner())
        console.log("OwnerAdress : " ,owner.address)
      expect(await pestToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await pestToken.balanceOf(owner.address);
      expect(await pestToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await pestToken.cap();
      expect(Number(hre.ethers.formatEther(cap))).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await pestToken.blockReward();
      expect(Number(hre.ethers.formatEther(blockReward))).to.equal(tokenBlockReward);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await pestToken.transfer(addr1.address, 50);
      const addr1Balance = await pestToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await pestToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await pestToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await pestToken.balanceOf(owner.address);
      await expect(
        pestToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith;

      expect(await pestToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await pestToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await pestToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await pestToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await pestToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - BigInt(150));

      const addr1Balance = await pestToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await pestToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
  
});