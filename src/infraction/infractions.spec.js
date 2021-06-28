'use strict';

const uuid = require('uuid').v4;
const expect = require('chai').expect;
const infractions = require('./infractions');

let validInfractionId = uuid();
let validInfractionTimestamp = (new Date()).toISOString();
let validInfractionInput = {
	reporter: 'test-reporter',
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
		await dao.put(validInfractionInput);
		expect(myPutItem.mock.calls.length).is.eq(1);
	});
});

describe('valid id', function() {
	it('can retrieve from database', async function() {
		let myGetItemResponse = {
			Item: {
				id: {"S": validInfractionId},
				reporter: {"S": 'test-reporter'},
				timestamp: {"S": validInfractionTimestamp},
				url: {"S": 'test-url'},
				type: {"S": 'test-type'},
				content: {"S": JSON.stringify('{}')}
			}
		};

		let myGetItem = jest.fn((parameters, callback) => {
			callback(undefined, myGetItemResponse);
		});

		let myDAO = new infractions.InfractionDAO({
			dynamodb: {
				getItem: myGetItem
			}
		});

		let infraction = await myDAO.get(validInfractionId);
		expect(infraction).to.exist;
		expect(infraction.id).to.eq(validInfractionId);
		expect(infraction.reporter).to.eq('test-reporter');
		expect(infraction.url).to.eq('test-url');
		expect(infraction.timestamp).to.eq(validInfractionTimestamp);
		expect(infraction.type).to.eq('test-type');
		expect(infraction.content).to.eq('{}');
	});
});
