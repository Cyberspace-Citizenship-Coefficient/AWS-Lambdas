#!/usr/bin/env node

const s3 = require('../s3');

const bucketName = 'ccc-indexed-bucket'

async function restoreWoS(wosKey) {
    const s3client = await s3.getClient();
    const params = { Bucket: bucketName, Key: 'WoS/' + wosKey }
    return s3client.getObject(params).promise()
        .then(data => JSON.parse(data.Body.toString()));
}

async function storeWoS(wosKey, wosData) {
    const s3client = await s3.getClient();
    const params = {
        Bucket: bucketName,
        Key: 'WoS/' + wosKey,
        ContentType: 'application/json',
        Body: JSON.stringify(wosData)
    }

    return s3client.putObject(params).promise();
}

module.exports = {
    put: storeWoS,
    get: restoreWoS
}

