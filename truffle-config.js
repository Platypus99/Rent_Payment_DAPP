const HDWalletProvider = require('@truffle/hdwallet-provider');
const privateKey= require('./secrets.json').privateKey;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },

    huygens: {
      // gasPrice: 1000000000000000,
      provider: () => new HDWalletProvider([priateKey], `http://18.182.45.18:8765`),
      // host: 'http://13.212.177.203',
      // port: 8765,
      network_id: 828, // 804
      confirmations: 0,
      // networkCheckTimeout: 10000,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },
  // Configure your compilers
  compilers:
   {
    solc: {
      version: "^0.7.0", // A version or constraint - Ex. "^0.8.0"
    }
  }
}