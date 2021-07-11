#!/usr/bin/node node
"use strict";

const vandium = require('vandium');
const infractions = require('./infractions.js');
const validation = require('./validation.js');

exports.handler = vandium.api()
	.GET()
		.validation({
			pathParameters: {
				id: 'string:min=36,max=36'
			}
		})
		.handler(async (event) => {
			let id = event.pathParameters.id;
			let infractionDAO = infractions.Singleton.getInstance();
			let infraction = await infractionDAO.get(id);
			return JSON.stringify(infraction);
		})
	.POST()
		.validation({

		})
		.handler(async (event) => {
			let infractionDAO = infractions.Singleton.getInstance();
			// event.body should contain a JSON object
			let infraction = {
				reporter: event.body.reporter,         // reporter
				url: event.body.url,                   // url
				type: event.body.type,                 // type
				content: event.body.content            // content
			};

			let result = await infractionDAO.put(infraction);
			return result.id;
		})
	.PUT()
		.validation({
			pathParameters: {
				id: 'string:min=36,max=36'
			},
			body: {
				action: 'string:required'
			}
		})
		.handler(async (event) => {
			let action = event.body.action;
			// actions need to be mapped to handlers... however, this is about as quick and dirty
			// as it gets.
			if (action.toLowerCase() == 'validate') {
				let infractionDAO = infractions.Singleton.getInstance();
				let infractionId = event.pathParameters.id;
				let infraction = await infractionDAO.get(infractionId);
				if (!infraction) {
					let error = new Error('Not Found');
					error.statusCode = 404;
					throw error;
				}

				await validation.Singleton.getInstance().validate(infraction);
			} else {
				let error = new Error('Bad Request');
				error.statusCode = 400;
				throw error;
			}
		});
