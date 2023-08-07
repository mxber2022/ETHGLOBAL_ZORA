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

    'optimismGoerli': {
      url: 'https://goerli.optimism.io/',
      accounts: ["d2ab6e77539c6d2ba90f19b217e26e4fad301e5066445514b4b63cba0fc80b6c"],
    },

    'baseGoerli': {
      url: 'https://base-goerli.public.blastapi.io/',
      accounts: ["d2ab6e77539c6d2ba90f19b217e26e4fad301e5066445514b4b63cba0fc80b6c"],
    },

  },

  etherscan: {
    apiKey: {
      "zora-goerli": "xx",
      "baseGoerli": "xx",
      "optimismGoerli": "YourKEY",
    },

    customChains: [
      {
        network: "zora-goerli",
        chainId: 999,
        urls: {
          apiURL: "https://testnet.explorer.zora.energy/api",
          browserURL: '',
        },

        network: "baseGoerli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: '',
        },

        network: "optimismGoerli",
        chainId: 420,
        urls: {
          apiURL: "https://api-goerli-optimistic.etherscan.io/api",
          browserURL: '',
        },

      },
    ],

  },
}
