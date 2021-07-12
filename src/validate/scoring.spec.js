'use strict';

const chai = require('chai');
const expect = chai.expect;

const scoring = require('./scoring');
const testData = require('./test-data');

describe( 'Creating a DAO', function() {
	it('succeeds when provided configuration', async function () {
		let dao = new scoring.ScoringDAO({});
		expect(dao).exist;
	});
});

describe( 'Storing a score', function() {
	it('succeeds', async function () {
		let myPutItem = jest.fn((parameters) => ({
			promise: () => Promise.resolve()
		}));
		let dao = new scoring.ScoringDAO({
			dynamodb: { putItem: myPutItem }
		});
		let score = testData.sampleScore;
		await dao.put(score);
		expect(myPutItem.mock.calls.length).to.eq(1);
	});

	it('fails', async function () {
		let myPutItem = jest.fn((parameters) => ({
			promise: () => Promise.reject('test failure')
		}));
		let dao = new scoring.ScoringDAO({
			dynamodb: { putItem: myPutItem }
		});
		let score = testData.sampleScore;
		let error;

		try {
			await dao.put(score);
		} catch (e) {
			error = e;
		}

		expect(error).to.exist;
		expect(error).to.eq('test failure');
		expect(myPutItem.mock.calls.length).to.eq(1);
	});

});

