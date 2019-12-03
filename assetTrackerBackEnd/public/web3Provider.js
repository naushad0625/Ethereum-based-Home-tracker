const Web3 = require('web3');
const EthereumNetworkConfig = require('./config.js');
const HomeArtifect = require('../build/contracts/House.json');
const OwnershipManagementArtifect = require('../build/contracts/OwnershipManagement.json');

class Web3Provider {

    constructor() {
        this.ethereumNetworkConfig = new EthereumNetworkConfig();

        this.setUp = this.setUp.bind(this);
        this.getArtifectNetworkAddress = this.getArtifectNetworkAddress.bind(this);
        this.createContractObject = this.createContractObject.bind(this);
        this.getHomeContract = this.getHomeContract.bind(this);
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
                    this.web3 = new Web3(new Web3.providers.HttpProvider(this.etheriumUrl));
                    return this.findUserAccount()
                })
                .then(user_account => {
                    this.userAccount = user_account;
                    let promises = [];
                    promises.push(this.getArtifectNetworkAddress(HomeArtifect));
                    promises.push(this.getArtifectNetworkAddress(OwnershipManagementArtifect));
                    return Promise.all(promises);
                })
                .then(artifectNetworkAddresses => {
                    let contractPromises = [];
                    this.homeContractNetAddress = artifectNetworkAddresses[0];
                    this.ownershipContractNetAddress = artifectNetworkAddresses[1];
                    contractPromises.push(this.createContractObject(HomeArtifect, this.homeContractNetAddress));
                    contractPromises.push(this.createContractObject(OwnershipManagementArtifect, this.ownershipContractNetAddress));
                    return Promise.all(contractPromises);
                })
                .then(contracts => {
                    this.homeContract = contracts[0];
                    this.ownershipContract = contracts[1];

                    resolve('Contracts are Created')
                })
                .catch(err => {
                    reject(err);
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

    getArtifectNetworkAddress(artifect) {
        return new Promise((resolve, reject) => {
            let allNetKeys = Object.keys(artifect.networks);
            let currentNetKey = allNetKeys[allNetKeys.length - 1];
            let currentNetworkAddress = artifect.networks[currentNetKey].address;

            if (currentNetworkAddress)
                resolve(currentNetworkAddress);
            reject(`'Contract's network address not found. Contract might not be deployed.`)
        })
    }

    createContractObject(artifect, net_address) {
        return new Promise((resolve, reject) => {
            const jsonInterface = artifect.abi;
            const contractsData = artifect.bytecode;
            let contract = new this.web3.eth.Contract(jsonInterface, net_address, {
                data: contractsData
            });

            if (contract) {
                resolve(contract);
            }
            reject('Could not create contract');
        })
    }

    getHomeContract() {
        return this.homeContract;
    }

    getOwnershipContract() {
        return this.ownershipContract;
    }

    getUserAccount() {
        return this.userAccount;
    }

    getWeb3() {
        return this.web3;
    }

}

module.exports = Web3Provider;