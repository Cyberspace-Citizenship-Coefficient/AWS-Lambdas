'use strict';

const uuid = require('uuid').v4;
const expect = require('chai').expect;
const infractions = require('./infractions');

let validInfractionId = uuid();
let validInfractionTimestamp = new Date();
let validInfraction = {
	id: validInfractionId,
	reporter: 'test-reporter',
	timestamp: validInfractionTimestamp,
	url: 'test-url',
	type: 'test-type',
	content: '{}'
};

describe( 'valid infractions', function() {
	let myPutItem = jest.fn((parameters, callback) => {
		callback(undefined, {});
	});
	let dao = new infractions.InfractionDAO({
		dynamodb: {
			putItem: myPutItem
		}
	});

	it('should be stored in database', async function () {

		await dao.put(validInfraction);
		expect(myPutItem.mock.calls.length).is.eq(1);
	});
});
