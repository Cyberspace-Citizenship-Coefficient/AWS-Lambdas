'use strict';

const expect = require('chai').expect;
const siteQuality = require('./siteQuality');

describe( 'storing a site', function() {
	it('should call putItem', async function () {
		let mockPutItem = jest.fn(() => ({
			promise() {
				return Promise.resolve({});
			}
		}));
		let dao = new siteQuality.SiteQualityDAO({
			dynamodb: {
				putItem: mockPutItem
			}
		});

		const siteName = 'www.wallstreetjournal.com';
		const siteValue = 5

		await dao.put({ 'site' : siteName, 'value' : siteValue })
		expect(mockPutItem.mock.calls.length).is.eq(1)
		expect(mockPutItem.mock.calls[0][0].TableName).is.eq('site-quality')
		expect(mockPutItem.mock.calls[0][0].Item).exist
		expect(mockPutItem.mock.calls[0][0].Item.site).exist
		expect(mockPutItem.mock.calls[0][0].Item.site.S).exist
		expect(mockPutItem.mock.calls[0][0].Item.site.S).is.eq(siteName)
		expect(mockPutItem.mock.calls[0][0].Item.value).exist
		expect(mockPutItem.mock.calls[0][0].Item.value.N).exist
		expect(mockPutItem.mock.calls[0][0].Item.value.N).is.eq(siteValue)
	});
});

describe( 'retrieiving a site', function() {
	it('should return results for existing value', async function () {
		const siteName = 'www.wallstreetjournal.com';
		const siteValue = 95

		let mockGetItem = jest.fn(() => ({
			promise() {
				return Promise.resolve({
					Item: {
						'site': { 'S' : siteName },
						'value': { 'N' : siteValue }
					}
				});
			}
		}));
		let dao = new siteQuality.SiteQualityDAO({
			dynamodb: {
				getItem: mockGetItem
			}
		});

		let result = await dao.get(siteName)
		expect(mockGetItem.mock.calls.length).is.eq(1)
		expect(mockGetItem.mock.calls[0][0].TableName).is.eq('site-quality')
		expect(mockGetItem.mock.calls[0][0].Key).exist
		expect(mockGetItem.mock.calls[0][0].Key.site).exist
		expect(mockGetItem.mock.calls[0][0].Key.site.S).exist
		expect(mockGetItem.mock.calls[0][0].Key.site.S).is.eq(siteName)

		expect(result.site).to.eq(siteName)
		expect(result.value).to.eq(siteValue)
		expect(result.rating).to.eq('bad')
	});

	it('should return unknown for missing value', async function () {
		const siteName = 'www.blueshoes.com';

		let mockGetItem = jest.fn(() => ({
			promise() {
				return Promise.resolve({});
			}
		}));
		let dao = new siteQuality.SiteQualityDAO({
			dynamodb: {
				getItem: mockGetItem
			}
		});

		let result = await dao.get(siteName)
		expect(mockGetItem.mock.calls.length).is.eq(1)
		expect(mockGetItem.mock.calls[0][0].TableName).is.eq('site-quality')
		expect(mockGetItem.mock.calls[0][0].Key).exist
		expect(mockGetItem.mock.calls[0][0].Key.site).exist
		expect(mockGetItem.mock.calls[0][0].Key.site.S).exist
		expect(mockGetItem.mock.calls[0][0].Key.site.S).is.eq(siteName)

		expect(result.site).to.eq(siteName)
		expect(result.rating).to.eq('unknown')
	});

});
