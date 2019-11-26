const Web3 = require('web3');
const EthereumNetworkConfig = require('./config.js');
const HomeArtifect = require('../build/contracts/House.json');

class Web3Provider {

    constructor() {
        this.ethereumNetworkConfig = new EthereumNetworkConfig();

        this.setUp = this.setUp.bind(this);
        this.getHomeArtifectNetworkAddress = this.getHomeArtifectNetworkAddress.bind(this);
        this.createContractObject = this.createContractObject.bind(this);
        this.getHoemContract = this.getHoemContract.bind(this);
        this.getUserAccount = this.getUserAccount.bind(this);
        this.findUserAccount = this.findUserAccount.bind(this);

        this.homeContract = null;
    }

    setUp() {
        return new Promise((resolve, reject) => {
            this.ethereumNetworkConfig
                .getEthereumUrl()
                .then(url => {
                    this.etheriumUrl = url;
                    //this.web3 = new Web3(new Web3.providers.HttpProvider(this.etheriumUrl));
                    this.web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/a4bc2e3f44644e80a4a2fb0ef525d32e"));
                    console.log(this.web3);
                    return this.findUserAccount()
                })
                .then(user_account => {
                    this.userAccount = user_account;
                    return this.getHomeArtifectNetworkAddress();
                })
                .then(currentNetworkAddress => {
                    this.homeContractNetAddress = currentNetworkAddress;
                    return this.createContractObject();
                })
                .then(home_contract => {
                    this.homeContract = home_contract;
                   resolve('Contract Created')
                })
                .catch(err => {
                    console.log(err);
                });
        })
    }

    findUserAccount() {
        return new Promise((resolve, reject) => {
            this.web3.eth
                .getAccounts()
                .then(accounts => {
                    if (accounts.length > 0) {
                        this.userAccount = accounts[0];
                        resolve(this.userAccount);
                    }
                    reject('No ethereum account has been found!');
                })

        })
    }

    getHomeArtifectNetworkAddress() {
        return new Promise((resolve, reject) => {
            let allNetKeys = Object.keys(HomeArtifect.networks);
            let currentNetKey = allNetKeys[allNetKeys.length - 1];
            let currentNetworkAddress = HomeArtifect.networks[currentNetKey].address;

            if (currentNetworkAddress)
                resolve(currentNetworkAddress);
            reject(`'Contract's network address not found. Contract might not be deployed.`)
        })
    }

    createContractObject() {
        return new Promise((resolve, reject) => {
            const jsonInterface = HomeArtifect.abi;
            const contractsData = HomeArtifect.bytecode;
            let homeContract = new this.web3.eth.Contract(jsonInterface, this.homeContractNetAddress, {
                data: contractsData
            });

            if(homeContract) {
                resolve(homeContract);
            }
            reject('Could not create contract');
        })
    }

    getHoemContract() {
        return this.homeContract;
    }

    getUserAccount() {
        return this.userAccount;
    }

    getWeb3() {
        return this.web3;
    }

}

module.exports = Web3Provider;