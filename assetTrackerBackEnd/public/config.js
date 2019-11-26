const tfconfig = require('../truffle-config.js');

class EthereumNetworkConfig {

    constructor() {

    }

    getEthereumUrl() {
        return new Promise((resolve, reject) => {
            // let ethereumNetwork = tfconfig.networks.development;
            // let url = `http://${ethereumNetwork.host}:${ethereumNetwork.port}`

            let ethereumNetwork = tfconfig.networks.ropsten;
            let url = ethereumNetwork.provider;
            resolve(url);
        })
    }
}

module.exports = EthereumNetworkConfig;