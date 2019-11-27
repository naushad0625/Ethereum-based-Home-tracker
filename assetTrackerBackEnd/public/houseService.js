const Web3Provider = require('./web3Provider.js');
const InputDataDecoder = require('ethereum-input-data-decoder');
const contractAbi = require('../build/contracts/House.json');

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
    }

    setWeb3() {
        this.web3Provider.setUp()
            .then(msg => {
                //console.log(msg);
                this.userAccount = this.web3Provider.getUserAccount();
                this.homeContract = this.web3Provider.getHoemContract();
                this.web3 = this.web3Provider.getWeb3();
            })
    }

    createHouse(req) {
        //console.log(req.body);
        return new Promise((resolve, reject) => {
            this.homeContract.methods
                .createHouse(
                    this.convertByte32(req.body.house_name),
                    this.convertByte32(req.body.house_woner),
                    this.convertByte32(req.body.house_no),
                    this.convertByte32(req.body.street),
                    this.convertByte32(req.body.city)
                )
                .send({
                    from: this.userAccount,
                    gas: 200000
                })
                .then(transaction => {
                    return this.homeContract.methods
                        .setTxHash(transaction.transactionHash)
                        .send({
                            from: this.userAccount,
                            gas: 200000
                        })

                })
                .then((response) => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                })

        })
    }

    findAll() {
        return new Promise((resolve, reject) => {
            let houseInfo = null;
            let homeIds = null;

            this.homeContract.methods
                .getAllHouseIds()
                .call({
                    from: this.userAccount
                })
                .then(home_ids => {
                    homeIds = home_ids;
                    let promises = homeIds.map((home_id) => {
                        return this.homeContract.methods
                            .getHouseById(home_id)
                            .call({
                                from: this.userAccount
                            })

                    })

                    return Promise.all(promises);
                })
                .then(houses => {
                    houseInfo = houses;
                    let promises = homeIds.map(home_id => {
                        return this.homeContract.methods
                            .getTxHash(home_id)
                            .call({
                                from: this.userAccount
                            })
                    })

                    return Promise.all(promises);
                })
                .then(tx_hashes => {
                    let houses = [];
                    houseInfo.forEach((house, index) => {
                        let h = [];
                        h.push(index + 1);
                        h.push(this.convertToString(house.house_name));
                        h.push(this.convertToString(house.woners_name));
                        h.push(this.convertToString(house.house_no) + '; ' +
                            this.convertToString(house.street) + '; ' +
                            this.convertToString(house.city_name));
                        h.push(tx_hashes[index]);

                        houses.push(h);
                    });

                    resolve(houses);
                })
                .catch(err => {
                    reject(err);
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

    getTxInputData(tx_input) {
        return new Promise((resolve, reject) => {

            let finalData = [];
            let value = this.web3.utils.hexToAscii(tx_input);
            value = value.replace(/\0/g, '/');

            let arr = value.split('/');
            arr[0] = arr[0].split(',')[1];

            arr.forEach(element => {
                if (element != '') {
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