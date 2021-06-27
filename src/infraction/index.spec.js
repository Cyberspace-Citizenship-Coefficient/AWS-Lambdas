'use strict';

const uuid = require('uuid');
const chai = require('chai');
const lambdaTester = require('lambda-tester');
const lambdaEventMock = require('lambda-event-mock');

//import { default as chai } from 'chai';
//import { default as lambdaTester } from 'lambda-tester';
//import { default as lambdaEventMock } from 'lambda-event-mock';

const myLambda = require('./index');
const infractions = require('./infractions');

const expect = chai.expect;

describe( 'Infraction GET', function() {
	let mockInfractionsDAO;
	const constTestId = uuid.v4();

	beforeEach(() => {
		// replace the actual InfractionsDAO with a mock
		mockInfractionsDAO = {
			get: jest.fn(value => {
				return {
					id: constTestId,
					timestamp: new Date(),
					reporter: 'test-reporter',
					url: 'https://test-url',
					type: 'test-type',
					content: {}
				}
			})
		};
		infractions.Singleton.setInstance(mockInfractionsDAO);
	});
	it('with id reads from DAO', async function () {
		let testEvent = lambdaEventMock.apiGateway()
			.path('/infraction')
			.pathParameters({ id : constTestId })
			.method('GET')
			.build();

		await lambdaTester(myLambda.handler)
			.event(testEvent)
			.expectResult((result) => {
				expect(result.statusCode).to.equal(200);
				expect(result.body).is.a('string');

				let value = JSON.parse(result.body);
				expect(value.id).to.equal(constTestId);
			});
	});
});


describe( 'Infraction POST', function() {
	it('should write to DAO', async function () {
		let infractionId = uuid.v4();
		let timestamp = (new Date()).toISOString();
		let daoResult = {
			id: infractionId,
			timestamp: timestamp,
			result: {}
		};

		// replace the actual InfractionsDAO with a mock
		let mockInfractionsDAO = {
			put: jest.fn(value => daoResult)
		};

		infractions.Singleton.setInstance(mockInfractionsDAO);

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
