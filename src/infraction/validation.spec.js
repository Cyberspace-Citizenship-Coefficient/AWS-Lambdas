'use strict';

const uuid = require('uuid').v4;
const expect = require('chai').expect;
const validation = require('./validation');

function createInfraction() {
	return {
		id: uuid(),
		timestamp: (new Date()).toISOString(),
		reporter: 'test-reporter',
		url: 'test-url',
		type: 'test-type',
		content: '{}'
	};
}

describe( '...', function() {
	let snsPublish = jest.fn((parameters, callback) => {
		callback(undefined, {});
	});
	let snsInstance = { publish: snsPublish }
	let validator = new validation.Validator({
		sns: snsInstance
	});

	it('should send to SNS', async function () {
		let infraction = createInfraction();
		let infractionAsJson = JSON.stringify(infraction);

		await validator.validate(infraction);

		expect(snsPublish.mock.calls.length).is.eq(1);

		let invocation = snsPublish.mock.calls[0][0];
		expect(invocation.Message).is.eq(infractionAsJson);
		expect(invocation.TopicArn).is.eq('validation_topic');
	});
});
