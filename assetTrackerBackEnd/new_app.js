const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const RouteHandler = require('./public/router.js');

class App {
    constructor() {
        this.app = express();
        this.routeHandler = new RouteHandler();
        this.configure = this.configure.bind(this);
        this.getApp = this.getApp.bind(this);

    }

    configure() {
        this.app.use(cors());
        this.app.use(morgan('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: false
        }))
        this.app.use('/', this.routeHandler.getRouter());
    }

    getApp() {
        return this.app;
    }
}

module.exports = App;