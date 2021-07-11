"use strict";

const AWS = require('aws-sdk');

// in a development environment, these values can be set as environment variables
// in a production environment, these values need to be resolvable

let appRegion = process.env.REGION || 'us-east-2';
let databasePort = process.env.DBPORT || 3306;
let databaseHost = process.env.DBHOST;
let databaseUser = process.env.DBUSER || 'ccc_aws_user';
let databasePass = process.env.DBPASSWORD;
let databaseConfig = undefined;

async function getDatabaseConfig() {
    if (databaseConfig) {
        return databaseConfig;
    }

    // we must resolve the password from the secrets manager
    let client = new AWS.SecretsManager({ region : appRegion });
    return new Promise((resolve, reject) => {
        client.getSecretValue({ SecretId: 'ccc_aws_config' }, function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                if ('SecretString' in data) {
                    databaseConfig = JSON.parse(data.SecretString);
                } else {
                    let buff = new Buffer(data.SecretBinary, 'base64');
                    databaseConfig = JSON.parse(buff.toString('ascii'));
                }
            }

            resolve(databaseConfig);
        });
    });
}

async function getDatabasePassword() {
    let config = await getDatabaseConfig();
    return config.password;
}

async function getDatabaseHost() {
    let config = await getDatabaseConfig();
    return config.host;
}

exports.dynamodb = {
    region: appRegion
};

exports.sns = {
    region: appRegion
};

exports.sqs = {
    region: appRegion
};

module.exports = exports;
