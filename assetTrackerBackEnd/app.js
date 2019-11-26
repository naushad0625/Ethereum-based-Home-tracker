const path = require('path');
const express = require('express');
const Web3Provider = require('./public/web3Provider.js');



class App {

    constructor() {
        this.app = express();
        this.configure();
        this.web3Provider = new Web3Provider();
        this.web3Provider.setUp();
    }

    configure() {
        this.app.use(express.static("public"));
    }
    
    getApp() {
        return this.app;
    }

}

module.exports = App;