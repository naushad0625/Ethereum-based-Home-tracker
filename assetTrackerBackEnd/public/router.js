const express = require('express');
const HouseController = require('./houseController.js');

class Router {

    constructor() {
        this.router = express.Router();
        this.houseController = new HouseController();
        this.router.get('/', this.houseController.findAll);
        this.router.post('/create', this.houseController.createHouse);
        this.router.post('/changeWoner', this.houseController.changWoner);
        this.router.get('/:tx_hash', this.houseController.getTransactionInfo);
        this.router.get('/tx/:tx_input', this.houseController.getTransactedData);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = Router;