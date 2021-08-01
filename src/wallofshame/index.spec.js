'use strict';

const chai = require('chai');
const lambdaTester = require('lambda-tester');
const lambdaEventMock = require('lambda-event-mock');
const myLambda = require('./index');
const expect = chai.expect;

describe( 'Retrieving WallOfShame', function() {
	it('without type', async function () {
		let testEvent = lambdaEventMock.apiGateway()
			.path('/wallofshame')
			.method('GET')
			.build();

		await lambdaTester(myLambda.handler)
			.event(testEvent)
			.expectResult((result) => {
				expect(result.statusCode).to.equal(200);
				expect(result.body).is.a('string');
			});
	});
});
