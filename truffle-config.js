/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  contracts_build_directory: './client/src/artifacts/',
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    sepolia: {
  provider: () => new HDWalletProvider(
    process.env.DEPLOYER_PRIVATE_KEY,
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.INFURA_API_KEY}`,
    0,
    1
  ),
  network_id: 11155111,
  gas: 5500000,
  gasPrice: 2000000000,  // Changed from 20000000000 to 2000000000 (2 gwei)
  confirmations: 2,
  timeoutBlocks: 200,
  skipDryRun: true,
  networkCheckTimeout: 10000
},
  },

  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      settings: {
        optimizer: {
          enabled: true,
          runs: 1000
        },
        evmVersion: "homestead"
      }
    }
  }
}