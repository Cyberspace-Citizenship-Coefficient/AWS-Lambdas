'use strict';

const mysql = require('mysql');
const AWS = require('aws-sdk');
const config = require('./config.js');

class ConnectionFactory {
    async getConnection() {
        return undefined;
    }
}

class DefaultConnectionFactory extends ConnectionFactory {
    async getConnection() {
        await mysql.createConnection({
            port: config.mysql.port,
            host: config.mysql.host,
            user: config.mysql.user,
            password: await config.mysql.password()
        })
    }
}

module.exports = {
    ConnectionFactory: ConnectionFactory,
    DefaultConnectionFactory: DefaultConnectionFactory,
    // DynamoDB
    dynamodb: {
        getClient: async function () {
            return new AWS.DynamoDB({region: config.dynamodb.region});
        }
    }
}
