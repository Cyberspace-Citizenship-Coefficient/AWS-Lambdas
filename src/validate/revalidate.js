#!/usr/bin/env node

const common = require('ccc-aws-common');
const validator = require('./base_validator');
const scoring = require('./scoring');

// a simple standalone application that can be used to revalidate
// one or multiple infractions

let args = process.argv.slice(2);

function reportError(error) {
    console.log("ERROR: error encountered");
    console.log(JSON.stringify(error));
}

function revalidateInfraction(infraction) {
    return validator.Singleton.getInstance()
        .validate(infraction)
        .then(() => {
            const scoringAlgorithm = new scoring.MarginalScoringAlgorithm()
            const score = scoringAlgorithm.score(infraction)
            const scoringDao = common.dao.scoring.Singleton.getInstance()
            return scoringDao.put(score);
        })
}

if (args.length == 0) {
    common.dao.infractions.Singleton.getInstance()
        .list()
        .then(async (infractions) => {
            while (infractions.length) {
                await Promise.allSettled(infractions.splice(0, 10).map(revalidateInfraction))
            }
        })
        .catch(error => reportError(error));
} else {
    let instance = common.dao.infractions.Singleton.getInstance()
    args.forEach(id => instance
        .get(id)
        .then(revalidateInfraction)
        .catch(error => {
            console.log('myerror')
            console.log(error);
        })
    );
}