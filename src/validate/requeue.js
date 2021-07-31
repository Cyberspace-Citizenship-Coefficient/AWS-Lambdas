#!/usr/bin/env node

const common = require('ccc-aws-common');
const validator = require('./base_validator');
const scoring = require('./scoring');

const validationTopic = process.env.ARN_TOPIC_VALIDATION;
if (!validationTopic) {
    console.log('ERROR: please set the ARN_TOPIC_VALIDATION');
    process.exit(-1);
}

// a simple standalone application that can be used to revalidate
// one or multiple infractions

let args = process.argv.slice(2);

function reportError(error) {
    console.log("ERROR: error encountered");
    console.log(JSON.stringify(error));
}

function requeueInfraction(infraction) {
    common.sns.sns.getClient()
        .then(sns => {
            let parameters = {
                Message: JSON.stringify(infraction),
                TopicArn: validationTopic
            }

            return sns.publish(parameters).promise()
                .then(() => console.log('Successful delivery to topic'))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

if (args.length == 0) {
    common.dao.infractions.Singleton.getInstance()
        .list()
        .then(infractions => infractions.forEach(requeueInfraction))
        .catch(error => reportError(error));
} else {
    let instance = common.dao.infractions.Singleton.getInstance()
    args.forEach(id => instance
        .get(id)
        .then(requeueInfraction)
        .catch(error => reportError(error))
    );
}