const HouseService = require('./houseService.js');

class HouseController {
    constructor() {
        this.houseService = new HouseService();
        this.findAll = this.findAll.bind(this);
        this.createHouse = this.createHouse.bind(this);
        this.changeOwner = this.changeOwner.bind(this);
        this.getOwnerByTxHash = this.getOwnerByTxHash.bind(this);
        this.getTransactedData = this.getTransactedData.bind(this);
        this.getTransactionInfo = this.getTransactionInfo.bind(this);
        this.getOwnershipTransactedData = this.getOwnershipTransactedData.bind(this);
    }

    createHouse(req, res, next) {
        this.houseService.createHouse(req)
            .then(() => {
                res.status(201).json({
                    msg: "Create new House"
                })
            });
    }

    changeOwner(req, res, next) {
        this.houseService
            .changeOwner(req)
            .then(msg => {
                res.status(201).json(msg);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    err: err
                })
            })
    }

    findAll(req, res, next) {
        this.houseService
            .findAll()
            .then(houses => {
                res.status(201).json(houses);
            })
            .catch(err => {
                res.status(500).json({
                    err: err
                })
            })
    }

    getTransactionInfo(req, res, next) {
        this.houseService
            .findTxInfo(req.params.tx_hash)
            .then(response => {
                res.status(201).json(response);
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    getTransactedData(req, res, next) {
        let tx_input = req.params.tx_input;

        this.houseService
            .getTxInputData(tx_input)
            .then(data => {
                res.status(201).json(data);
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    getOwnerByTxHash(req, res, next) {
        this.houseService.findOwnerByTxHash(req.params.tx_hash)
            .then(owner => {
                res.status(201).json(owner);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            })
    }

    getOwnershipTransactedData(req, res, next) {
        this.houseService
            .findOwnershipTxDataByTxInput(req.params.tx_input_data)
            .then(data => {
                res.status(201).json(data);
            })
            .catch(err => {
                res.status(500).json(err);
            })

    }
}

module.exports = HouseController;