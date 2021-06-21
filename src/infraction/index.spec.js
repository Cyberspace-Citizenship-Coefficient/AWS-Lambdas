'use strict';

const chai = require('chai');
const lambdaTester = require('lambda-tester');
const lambdaEventMock = require('lambda-event-mock');

//import { default as chai } from 'chai';
//import { default as lambdaTester } from 'lambda-tester';
//import { default as lambdaEventMock } from 'lambda-event-mock';

const myLambda = require('./index');
const infractions = require('./infractions');

const expect = chai.expect;

describe( 'myLambda', function() {
	let mockInfractionsDAO;

	beforeEach(() => {
		// replace the actual InfractionsDAO with a mock
		mockInfractionsDAO = {
			put: jest.fn(value => {
				// do nothing
			})
		};
		infractions.Singleton.setInstance(mockInfractionsDAO);
	});
	it('test success', async function () {
		let testInfraction = {
			'reporter':  'test-reporter',
			'url': 'test-url',
			'type': 'test-type', 
			'content': '{}'
		};
		let testEvent = lambdaEventMock.apiGateway()
			.path('/infraction')
			.method('POST')
			.body(JSON.stringify(testInfraction))
			.build();

		await lambdaTester(myLambda.handler)
			.event(testEvent)
			.expectResult((result) => {
				expect(result.statusCode).to.equal(201);
				expect(mockInfractionsDAO.put.mock.calls.length).to.be.equal(1);
				// extract the invocation
				let firstCall = mockInfractionsDAO.put.mock.calls[0][0];
				expect(firstCall.reporter).is.eq('test-reporter');
				expect(firstCall.url).is.eq('test-url');
				expect(firstCall.type).is.eq('test-type');
			});
	});
});
