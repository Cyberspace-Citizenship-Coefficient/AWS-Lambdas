#!/usr/bin/node node
"use strict";

const vandium = require('vandium');
const validator = require('./base_validator');
const common = require('ccc-aws-common');
const scoring = require('./scoring');

exports.handler = vandium.sqs((records, context) => {
	return Promise.all(records.map(record => {
		// Each record represents one infraction that needs to be validated. Under normal
		// circumstances, the lambda will be structured to allow only a single record per
		// invocation.  However, we should still be prepared to receive multiple records.
		let messageBody = JSON.parse(record.body);
		let infraction = JSON.parse(messageBody.Message);
		// Use infraction.type to determine what handling you intend
		return validator.Singleton.getInstance()
			.validate(infraction)
			.then(result => {
				if (result) {
					const scoringAlgorithm = new scoring.MarginalScoringAlgorithm()
					const score = scoringAlgorithm.score(infraction)
					const scoringDao = common.dao.scoring.Singleton.getInstance()
					return scoringDao.put(score);
				}
			})
			.catch(error => {
				console.log("ERROR: unable to process infraction " + infraction.id);
				console.log(JSON.stringify(error));
			});
	}));
});
