'use strict';

const uuid = require('uuid');
const chai = require('chai');
const lambdaTester = require('lambda-tester');
const lambdaEventMock = require('lambda-event-mock');

const myLambda = require('./index');
const validator = require('./validation');
const infractions = require('ccc-aws-common').dao.infractions;

const expect = chai.expect;

function createInfraction(id) {
	if (!id) {
		id = uuid.v4();
	}

	return {
		id: id,
		timestamp: (new Date()).toISOString(),
		reporter: 'test-reporter',
		url: 'https://test-url',
		type: 'test-type',
		content: {}
	};
}

describe( 'Infraction GET', function() {
	let mockInfractionsDAO;
	const constTestId = uuid.v4();

	beforeEach(() => {
		// replace the actual InfractionsDAO with a mock
		mockInfractionsDAO = {
			get: jest.fn(value => createInfraction(constTestId))
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


describe( 'Infraction PUT', function() {
	it('with validate action should post to validator', async function () {
		let infractionEntity = createInfraction();
		let infractionsGetFunction = jest.fn(_id => {
			return infractionEntity;
		});
		let infractionsInstance = {
			get: infractionsGetFunction
		};
		infractions.Singleton.setInstance(infractionsInstance);

		let validateFunction = jest.fn(value => { })
		let validatorInstance = {
			validate: validateFunction
		};
		validator.Singleton.setInstance(validatorInstance);

		let id = uuid.v4();
		let body = JSON.stringify({ 'action' : 'validate' });
		let event = lambdaEventMock.apiGateway()
			.path('/infraction')
			.pathParameters({ id: id })
			.method('PUT')
			.body(body)
			.build();

		await lambdaTester(myLambda.handler)
			.event(event)
			.expectResult((result) => {
				expect(result.statusCode).to.eq(200);
				expect(infractionsGetFunction.mock.calls.length).to.eq(1);
				expect(validateFunction.mock.calls.length).to.eq(1);

				let validationInvocation = validateFunction.mock.calls[0][0];
				expect(validationInvocation).to.eq(infractionEntity);
			});
	});

	it('with validate action and invalid id should fail', async function() {
		let infractionId = uuid.v4();
		let infractionsGetFunction = jest.fn(_id => undefined);
		let infractionsInstance = {
			get: infractionsGetFunction
		};
		infractions.Singleton.setInstance(infractionsInstance);

		let body = JSON.stringify({ 'action' : 'validate' });
		let event = lambdaEventMock.apiGateway()
			.path('/infraction')
			.pathParameters({ id: infractionId })
			.method('PUT')
			.body(body)
			.build();

		await lambdaTester(myLambda.handler)
			.event(event)
			.expectResult((result) => {
				expect(result.statusCode).to.eq(404);
				expect(infractionsGetFunction.mock.calls.length).to.eq(1);
			});
	});

	it('with invalid action should fail', async function() {
		let infractionId = uuid.v4();
		let infractionsGetFunction = jest.fn(_id => undefined);
		let infractionsInstance = {
			get: infractionsGetFunction
		};
		infractions.Singleton.setInstance(infractionsInstance);

		let body = JSON.stringify({ 'action' : 'invalid' });
		let event = lambdaEventMock.apiGateway()
			.path('/infraction')
			.pathParameters({ id: infractionId })
			.method('PUT')
			.body(body)
			.build();

		await lambdaTester(myLambda.handler)
			.event(event)
			.expectResult((result) => {
				expect(result.statusCode).to.eq(400);
				expect(infractionsGetFunction.mock.calls.length).to.eq(0);
			});
	});
});
