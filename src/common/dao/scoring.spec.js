'use strict';

const chai = require('chai');
const expect = chai.expect;

const scoring = require('./scoring');
const testData = require('ccc-aws-common-test');

describe( 'Creating a DAO', function() {
	it('succeeds when provided configuration', async function () {
		let dao = new scoring.ScoringDAO({});
		expect(dao).exist;
	});
});

describe( 'Storing a score', function() {
	it('succeeds', async function () {
		let updateItem = jest.fn(() => ({
			promise: () => Promise.resolve()
		}));
		let dao = new scoring.ScoringDAO({
			dynamodb: { updateItem: updateItem }
		});
		let score = testData.sampleScore;
		await dao.put(score);
		expect(updateItem.mock.calls.length).to.eq(1);
	});

	it('fails', async function () {
		let updateItem = jest.fn(() => ({
			promise: () => Promise.reject('test failure')
		}));
		let dao = new scoring.ScoringDAO({
			dynamodb: { updateItem: updateItem }
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
		expect(updateItem.mock.calls.length).to.eq(1);
	});
});

