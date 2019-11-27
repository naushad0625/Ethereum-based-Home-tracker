const tfconfig = require('../truffle-config.js');

class EthereumNetworkConfig {

    constructor() {

    }

    getEthereumUrl() {
        return new Promise((resolve, reject) => {
            let ethereumNetwork = tfconfig.networks.development;
            let url = `http://${ethereumNetwork.host}:${ethereumNetwork.port}`
            resolve(url);
        })
    }
}

module.exports = EthereumNetworkConfig;