const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("PestToken", (m) => {
  const tokenArgs = [50000000, 50];
  const token = m.contract("PestToken", tokenArgs);
  console.log("PestToken deployment successful!");

  return { token };
});

module.exports = TokenModule;