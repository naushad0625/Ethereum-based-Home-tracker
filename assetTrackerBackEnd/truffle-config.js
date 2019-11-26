//const HDWalletProvider = require('');
///const MNEMONIC = 'knock place surface beauty barrel average chat electric project collect movie cook';
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "about urban vacuum knee height history voyage large range heavy crumble digital";

const ropstenUrl = "https://ropsten.infura.io/v3/a4bc2e3f44644e80a4a2fb0ef525d32e";


module.exports = {

  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, ropstenUrl),
      network_id: 3
    }
    
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
