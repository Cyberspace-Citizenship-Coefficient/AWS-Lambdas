#!/usr/bin/node node

"use strict";

const vandium = require('vandium');
const siteQualityDAO = require('./siteQualityDAO')

exports.handler = vandium.api()
	.GET()
		.validation({
			queryStringParameters: {
				site: 'string:required'
			}
		})
		.handler(async (event) => {
			let site = event.queryStringParameters.site;
			let instance = siteQualityDAO.Singleton.getInstance()
			let siteQuality = await instance.get(site);
			return JSON.stringify(siteQuality);
		})
	.POST()
		.validation({

		})
		.handler(async (event) => {
			let instance = siteQualityDAO.Singleton.getInstance()
			let siteQuality = {
				site: event.site,
				value: event.value
			};
			instance.put(siteQuality);
			return JSON.stringify({});
		});
