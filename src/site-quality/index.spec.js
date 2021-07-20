'use strict';

const expect = require('chai').expect;
const lambdaTester = require('lambda-tester');
const lambdaEventMock = require('lambda-event-mock');

const myLambda = require('./index');
const siteQualityDAO = require('./siteQualityDAO');

const siteName = 'www.transactqrs.com'
const siteRating = 'iffy'
const siteValue = 35

describe( 'Getting a site quality', function() {
	it('for site that exists', async function () {
		let siteQuality = {
			site: siteName,
			value: siteValue,
			rating: siteRating
		};

		siteQualityDAO.Singleton.setInstance({
			get: jest.fn(() => {
				return Promise.resolve(siteQuality);
			})
		});

		let event = lambdaEventMock.apiGateway()
			.path('/site-quality')
			.queryStringParameters({ site : siteName })
			.method('GET')
			.build();

		await lambdaTester(myLambda.handler)
			.event(event)
			.expectResult((result) => {
				expect(result.statusCode).to.eq(200);
				expect(result.body).is.a('string');

				let value = JSON.parse(result.body);
				expect(value.site).to.eq(siteName);
				expect(value.value).to.eq(siteValue);
				expect(value.rating).to.eq(siteRating);
			});
	});

	it('for site that does not exist', async function () {
		let siteQuality = {
			site: siteName,
			rating: 'unknown'
		};

		siteQualityDAO.Singleton.setInstance({
			get: jest.fn(() => {
				return Promise.resolve(siteQuality);
			})
		});

		let event = lambdaEventMock.apiGateway()
			.path('/site-quality')
			.queryStringParameters({ site : siteName })
			.method('GET')
			.build();

		await lambdaTester(myLambda.handler)
			.event(event)
			.expectResult((result) => {
				expect(result.statusCode).to.eq(200);
				expect(result.body).is.a('string');

				let value = JSON.parse(result.body);
				expect(value.site).to.eq(siteName);
				expect(value.rating).to.eq('unknown');
				expect(value.value).not.exist;
			});
	});
});
