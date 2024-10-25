require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia:{
      url: process.env.INFURA_SEPOLIA_KEY,
      accounts: [process.env.PRIVATE_KEY],
    }
  }
};
