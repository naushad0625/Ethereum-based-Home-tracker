//const HDWalletProvider = require('');
///const MNEMONIC = 'knock place surface beauty barrel average chat electric project collect movie cook';

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    }
    // ropsten: {
    //   provider: function() {
    //     return new HDWalletProvider(MNEMONIC, "ropsten.infura.io/v3/a4bc2e3f44644e80a4a2fb0ef525d32e")
    //   },
    //   network_id: 3,
    //   gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    // }
  },

  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {

    }
  }
}
