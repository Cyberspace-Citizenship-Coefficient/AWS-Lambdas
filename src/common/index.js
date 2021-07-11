const db = require('./db');
const sns = require('./sns');
const sqs = require('./sqs');
const config = require('./config');

module.exports = {
    config: config,
    db: db,
    sns: sns,
    sqs: sqs
};
