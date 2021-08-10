'use strict';

const uuid = require('uuid').v4;
const expect = require('chai').expect;
const devices = require('./devices');

let deviceId = uuid();
let timestamp = (new Date()).toISOString();
let sourceIP = '192.168.1.1';

describe( 'valid devices', function() {
	it('should be stored in database', async function () {
		let myPutItem = jest.fn(() => ({
			promise: () => Promise.resolve(undefined)
		}));
		let devicesDAO = new devices.DeviceDAO({
			dynamodb: {
				putItem: myPutItem
			}
		});
		let device = {
			id: deviceId,
			timestamp: timestamp,
			source_ip: sourceIP
		};

		await devicesDAO.put(device);
		expect(myPutItem.mock.calls.length).is.eq(1);
	});
});
