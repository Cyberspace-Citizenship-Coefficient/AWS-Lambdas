'use strict';

const AWS = require('aws-sdk');
const config = require('./config.js');

module.exports = {
    // DynamoDB
    dynamodb: {
        getClient: async function () {
            return new AWS.DynamoDB({region: config.dynamodb.region});
        }
    }
}
