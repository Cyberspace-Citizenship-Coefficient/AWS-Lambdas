'use strict';

const mysql = require('mysql');
const config = require('./config.js').db;

//import { createConnection } from 'mysql';
//import * as config from './config.js';

class ConnectionFactory {
    async getConnection() {
        return undefined;
    }
}

class DefaultConnectionFactory extends ConnectionFactory {
    async getConnection() {
        await mysql.createConnection({
            port: config.port,
            host: config.host,
            user: config.user,
            password: await config.password()
        })
    }
}

exports = {
    ConnectionFactory: ConnectionFactory,
    DefaultConnectionFactory: DefaultConnectionFactory
}