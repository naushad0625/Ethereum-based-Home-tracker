const Web3Provider = require('./web3Provider.js');

class HouseService {
    constructor() {
        this.web3Provider = new Web3Provider();
        this.setWeb3();

        this.setWeb3 = this.setWeb3.bind(this);
        this.findAll = this.findAll.bind(this);
        this.findTxInfo = this.findTxInfo.bind(this);
        this.createHouse = this.createHouse.bind(this);
        this.convertByte32 = this.convertByte32.bind(this);
        this.getTxInputData = this.getTxInputData.bind(this);
        this.findOwnerByTxHash = this.findOwnerByTxHash.bind(this);
    }

    setWeb3() {
        this.web3Provider.setUp()
            .then(msg => {
                this.userAccount = this.web3Provider.getUserAccount();
                this.homeContract = this.web3Provider.getHomeContract();
                this.ownershipContract = this.web3Provider.getOwnershipContract();
                this.web3 = this.web3Provider.getWeb3();
            })
    }

    createHouse(req) {
        return new Promise((resolve, reject) => {

            let homeTransaction = null;

            this.homeContract.methods
                .createHouse(
                    this.convertByte32(req.body.house_name),
                    this.convertByte32(req.body.house_no),
                    this.convertByte32(req.body.street),
                    this.convertByte32(req.body.city)
                )
                .send({
                    from: this.userAccount,
                    gas: 210000
                })
                .then(transaction => {

                    homeTransaction = transaction;

                    return this.homeContract.methods
                        .setTxHash(transaction.transactionHash)
                        .send({
                            from: this.userAccount,
                            gas: 200000
                        })

                })
                .then(() => {
                    let ownersName = this.convertByte32(req.body.house_owner);

                    return this.ownershipContract.methods
                        .addOwnership(homeTransaction.transactionHash, ownersName)
                        .send({
                            from: this.userAccount,
                            gas: 200000
                        })

                })
                .then((transaction) => {
                    return this.ownershipContract.methods
                        .setOwnershipTxHash(homeTransaction.transactionHash, transaction.transactionHash)
                        .send({
                            from: this.userAccount,
                            gas: 200000
                        })
                })
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                })

        })
    }

    findAll() {
        return new Promise((resolve, reject) => {
            let txHashes = null;
            let houseInfo = null;
            let ownersInfo = null;
            let houseHashes = null;

            this.homeContract.methods
                .getAllHouseHashes()
                .call({
                    from: this.userAccount
                })
                .then(house_hashes => {
                    houseHashes = house_hashes;
                    let promises = houseHashes.map((house_hash) => {
                        return this.homeContract.methods
                            .getHouseByHash(house_hash)
                            .call({
                                from: this.userAccount
                            })

                    })

                    return Promise.all(promises);
                })
                .then(houses => {
                    houseInfo = houses;
                    let promises = houseHashes.map(house_hash => {
                        return this.homeContract.methods
                            .getTxHash(house_hash)
                            .call({
                                from: this.userAccount
                            })
                    })

                    return Promise.all(promises);
                })
                .then(tx_hashes => {
                    txHashes = tx_hashes;

                    let ownerPromises = txHashes.map(tx_hash => {
                        return this.ownershipContract.methods
                            .getOwnersInfo(tx_hash)
                            .call({
                                from: this.userAccount
                            })
                    })

                    return Promise.all(ownerPromises);
                })
                .then(owners_info => {
                    ownersInfo = owners_info;

                    let ownershipTxPromises = txHashes.map(tx_hash => {
                        return this.ownershipContract.methods
                            .getOwnershipTransactionInfo(tx_hash)
                            .call({
                                from: this.userAccount
                            })
                    })

                    return Promise.all(ownershipTxPromises);
                })
                .then(ownershipTxInfo => {
                    let houses = [];
                    houseInfo.forEach((house, index) => {
                        let h = [];
                        h.push(index + 1);
                        h.push(this.convertToString(house.house_name));
                        h.push(this.convertToString(ownersInfo[index][0]));
                        h.push(this.convertToString(house.house_no) + '; ' +
                            this.convertToString(house.street) + '; ' +
                            this.convertToString(house.city_name));
                        h.push(txHashes[index]);
                        h.push(ownersInfo[index][1]);
                        h.push(ownershipTxInfo[index]);

                        houses.push(h);
                    });

                    resolve(houses);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    }

    changeOwner(req) {
        return new Promise((resolve, reject) => {

            let houseTxHash = req.body.house_tx_hash;
            let newOwnersAddress = req.body.new_owners_address;
            let currentOwnersAddress = req.body.current_owners_address;
            let newOwnersName = this.convertByte32(req.body.new_owners_name);

            this.ownershipContract.methods
                .changeOwnership(houseTxHash, newOwnersName, newOwnersAddress)
                .send({
                    from: currentOwnersAddress,
                    gas: 200000
                })
                .then(transaction => {
                    console.log(transaction);
                    return this.ownershipContract.methods
                        .setOwnershipTxHash(houseTxHash, transaction.transactionHash)
                        .send({
                            from: currentOwnersAddress,
                            gas: 200000
                        })
                })
                .then(() => {
                    resolve('Ownership changed successfully');
                })
                .catch(err => {
                    console.log(err);
                    reject('Error changing ownership');
                })
        })
    }

    findTxInfo(transaction_hash) {
        return new Promise((resolve, reject) => {
            this.web3.eth
                .getTransaction(transaction_hash)
                .then(response => {
                    resolve(Object.values(response));
                })
                .catch('Could not find information');
        })
    }

    findOwnerByTxHash(transaction_hash) {

        return new Promise((resolve, reject) => {
            this.ownershipContract.methods
                .getOwnersInfo(transaction_hash)
                .call({
                    from: this.userAccount
                })
                .then(result => {
                    let owner = Object.values(result);
                    owner[0] = this.convertToString(owner[0]);
                    resolve(owner);
                })
                .catch('Could not find information');
        })
    }

    getTxInputData(tx_input) {
        return new Promise((resolve, reject) => {

            let finalData = [];
            let value = this.web3.utils.hexToAscii(tx_input);
            value = value.replace(/\0/g, '/');
            console.log(value);

            let arr = value.split('/');
            arr[0] = arr[0].split('\u0015F®Ü')[1];

            arr.forEach(element => {
                if (element != '') {
                    finalData.push(element);
                }
            });

            console.log(finalData);
            resolve(finalData);
        })
    }

    findOwnershipTxDataByTxInput(tx_input) {
        return new Promise((resolve, reject) => {

            let finalData = [];
            let value = this.web3.utils.hexToAscii(tx_input);
            value = value.replace(/\0/g, '/').split('/');

            value.forEach(element => {
                if (element.length > 0) {
                    finalData.push(element);
                }
            });

            resolve(finalData);
        })
    }

    convertToString(data) {
        let value = this.web3.utils.hexToUtf8(data);
        return value;
    }

    convertByte32(data) {
        let value = this.web3.utils.fromAscii(data);
        return value;

    }
}

module.exports = HouseService;