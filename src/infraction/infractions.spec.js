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
	let myQuery = jest.fn((stmt, stmtParams) => {
		// no-op
	});
	let myConnection = { query: myQuery };
	let myGetConnection = jest.fn( () => myConnection);
	let infractionDAO = new infractions.InfractionDAO({
		getConnection: myGetConnection
	});

	it('should be stored in database', async function () {

		await infractionDAO.put(validInfraction);
		expect(myGetConnection.mock.calls.length).is.eq(1);
	});
});
