require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.9",

  networks: {
    'zoragoerli': {
      url: 'https://testnet.rpc.zora.energy/',
      accounts: ["d2ab6e77539c6d2ba90f19b217e26e4fad301e5066445514b4b63cba0fc80b6c"],
    },
  },

  etherscan: {
    apiKey: {
      "zora-goerli": "xx",
    },

    customChains: [
      {
        network: "zora-goerli",
        chainId: 999,
        urls: {
          apiURL: "https://testnet.explorer.zora.energy/api",
          browserURL: '',
        },
      },
    ],

  },
}
