#!/usr/bin/node node
"use strict";

const vandium = require('vandium');
const infractions = require('./infractions.js');

//import { default as vandium } from 'vandium';
//import * as infractions from './infractions';
//import * as uuid from 'uuid';

/*
//https://www.google.com/maps/place/Hurts+Donut+Co./@41.5906877,-90.4613467,18.75z/data=!4m5!3m4!1s0x87e237589f7183cf:0x9ae594f08efebce7!8m2!3d41.5906647!4d-90.4610724
infraction = {
	site: string, // "www.google.com"
	path: string, // "maps/place/Hurts+Donut+Co./@41.5906877,-90.4613467,18.75z"
	params: string, // "data=!4m5!3m4!1s0x87e237589f7183cf:0x9ae594f08efebce7!8m2!3d41.5906647!4d-90.4610724"
	infraction: ??, //
	infractionID: xxxxx,
	reportedElement: String // HTML ID or <html element(s)>
}
*/

/*
event = {
	infractionID: xxxxx
}
*/

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
		});

/*

exports.handler = async (event) => {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
	
	// Get Infraction Data by ID
	//https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html
	//const infraction = await ddb.getItem({
	//	TableName: 'TABLE',
	//	Key: {
	//		'KEY_NAME': {N: '001'}
	//	},
	//	ProjectionExpression: 'ATTRIBUTE_NAME'
	//})
	const infraction = {site: "www.serebii.net"}
	const redirect = await fetch(`http://${infraction.site}`)
	if (redirect.redirected) {
		console.log("Redirected")
		if (`https://${infraction.site}/` !== redirect.url) {
			console.log("Redirected to a different site")
		}
	} else {
		// Submit a new infraction that they did not redirect you to a https site!
		console.log("Not Redirected to HTTPS")
	}
	
	// This is a placeholder for the validation routine.  For now, this handler
    // will simply return an error to the caller indicating that the request has
    // failed.
    return {
        statusCode: 501, // Not Implemented
        body: ''
    };
};
*/
