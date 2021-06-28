#!/usr/bin/node node

"use strict";

const vandium = require('vandium');
const devices = require('./devices.js');

exports.handler = vandium.api()
	.GET()
		.validation({
			pathParameters: {
				id: 'string:min=36,max=36'
			}
		})
		.handler(async (event) => {
			let id = event.pathParameters.id;
			let deviceDAO = devices.Singleton.getInstance();
			let device = deviceDAO.get(id);
			return JSON.stringify(device);
		})
	.POST()
		.validation({

		})
		.handler(async (event) => {
			console.log(JSON.stringify(event));
			let deviceDAO = devices.Singleton.getInstance();
			let device = {
				source_ip: '127.0.0.1'  // source
			};

			let deviceId = await deviceDAO.put(device);
			return JSON.stringify(deviceId);
		});
