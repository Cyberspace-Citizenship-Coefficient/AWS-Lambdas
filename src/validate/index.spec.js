'use strict';

const uuid = require('uuid');
const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const lambdaEventMock = require('lambda-event-mock');

const myLambda = require('./index');
const validator = require('./base_validator')
const testData = require('ccc-aws-common-test');

describe( 'Performing a validation', function() {
	it('requires a valid infraction', async function () {
		let validateFunction = jest.fn(async (infraction) => {});
		validator.Singleton.setInstance({
			validate: validateFunction
		});

		let event = lambdaEventMock.sqs()
			.messageId(uuid.v4())
			.receiptHandle("receipt-handle")
			.eventSourceARN(testData.sampleTopicArn)
			.body(testData.sampleBody)
			.build();

		await lambdaTester(myLambda.handler)
			.event(event)
			.expectResult((result) => {
				// validator should be called at least once
				expect(validateFunction.mock.calls.length).to.eq(1);
				// input to the validator should be a single infraction that matches the sample data
				let mockArguments = validateFunction.mock.calls[0];
				expect(mockArguments.length).to.eq(1);
				let mockInfraction = mockArguments[0];
				expect(mockInfraction.id).to.eq(testData.sampleInfractionId);
				expect(mockInfraction.reporter).to.eq(testData.sampleInfractionReporter);
			});
	});
});
