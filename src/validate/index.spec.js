'use strict';

const uuid = require('uuid');
const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const lambdaEventMock = require('lambda-event-mock');

const myLambda = require('./index');

describe( 'Getting a validate', function() {
	it('returns a value when exists', async function () {
		let validateId = uuid.v4();
		let validate = {
			id: validateId,
			timestamp: (new Date()).toISOString(),
			source_ip: undefined
		};

		let event = lambdaEventMock.apiGateway()
			.path('/validate')
			.pathParameters({ id : validateId })
			.method('GET')
			.build();

		await lambdaTester(myLambda.handler)
			.event(event)
			.expectResult((result) => {
				expect(result.statusCode).to.eq(200);
				expect(result.body).is.a('string');

				let value = JSON.parse(result.body);
				expect(value.id).to.eq(validateId);
			});
	});
});


describe( 'Storing a validate', function() {
	it('should succeed when valid', async function () {
		let sourceIP = '127.0.0.1'; // default ip (for now)
		let validate = {
			source_ip: sourceIP
		};

		let event = lambdaEventMock.apiGateway()
			.path('/validate')
			.method('POST')
			.body(JSON.stringify(validate))
			.build();

		let putFunc = jest.fn(value => uuid.v4())

		validates.Singleton.setInstance({
			put: putFunc
		});

		await lambdaTester(myLambda.handler)
			.event(event)
			.expectResult((result) => {
				expect(result.statusCode).to.equal(201);

				expect(result.body).is.a('string');
				expect(result.body).has.length(38);

				expect(putFunc.mock.calls.length).to.be.equal(1);
				let firstCall = putFunc.mock.calls[0][0];
				expect(firstCall.source_ip).is.eq(sourceIP);
			});
	});
});
