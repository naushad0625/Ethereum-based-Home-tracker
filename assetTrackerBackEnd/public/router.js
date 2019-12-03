const express = require('express');
const HouseController = require('./houseController.js');

class Router {

    constructor() {
        this.router = express.Router();
        this.houseController = new HouseController();

        this.router.post('/create', this.houseController.createHouse);
        this.router.post('/changeOwner', this.houseController.changeOwner);

        this.router.get('/', this.houseController.findAll);
        this.router.get('/:tx_hash', this.houseController.getTransactionInfo);
        this.router.get('/tx/:tx_input', this.houseController.getTransactedData);
        this.router.get('/owner/:tx_hash', this.houseController.getOwnerByTxHash);
        this.router.get('/owner/tx/:tx_input_data', this.houseController.getOwnershipTransactedData);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = Router;