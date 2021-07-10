#!/usr/bin/node node
"use strict";

const vandium = require('vandium');
const puppeteer = require('puppeteer');


exports.handler = vandium.api()
	.POST()
		.validation({

		})
		.handler(async (event) => {
			console.log(JSON.stringify(event));
			return JSON.stringify({});
		});

/*
URL (String) URL to validate
specificValidator (Function) function to call for validation
reportedElement (Object) 
*/
const baseValidator = async (URL, specificValidator, reportedElement) => {
	let browser, page;
	
	browser = await puppeteer.launch({ 
		args: [
			"--no-sandbox", 
			"--start-fullscreen"
		],
		ignoreHTTPSErrors:true,
		headless: true
	});

	let result = '';
	try {
		page = await browser.newPage();
		await page.goto(URL, {waitUntil: 'networkidle0'});
		await page.exposeFunction('VALIDATE', specificValidator);
		
		result = await page.evaluate(async (badElement) => {
			// Find the element that was reported 
			const query = badElement.path
				.filter(x => x.localName != undefined)
				.map(x => x.localName)
				.reverse()
				.join(' > ')
			const possibleElements = document.querySelectorAll(query)
			let element = [...possibleElements].filter(n => n.outerHTML == badElement.outerHTML);
			
			// Call the validator
			return await window.VALIDATE(element[0].outerHTML)
		}, reportedElement);
	} catch (error) {
		console.log('ERROR OCCURED')
		console.log(error)
		result = "UNVALIDATIBLE"
	}
	
	browser.close();
	console.log(result)
	return result
}

const report = {
	"content": {
		"outerHTML": "<a class=\"snippet-btn snippet-subscribe-btn\" href=\"https://store.wsj.com/shop/us/us/wsjusfjs21/?inttrackingCode=aaqxesho&amp;icid=WSJ_ON_SPG_ACQ_NA&amp;n2IKsaD9=n2IKsaD9&amp;Pg9aWOPT=Pg9aWOPT&amp;Cp5dKJWb=Cp5dKJWb&amp;APCc9OU1=APCc9OU1&amp;cx_campaign=WSJUSJulyFourthFY21\">\n            Subscribe\n          </a>",
		"path": [
			{
				"ID": "",
				"localName": "a"
			},
			{
				"ID": "",
				"localName": "div"
			},
			{
				"ID": "",
				"localName": "div"
			},
			{
				"ID": "",
				"localName": "div"
			},
			{
				"ID": "",
				"localName": "div"
			},
			{
				"ID": "",
				"localName": "div"
			},
			{
				"ID": "",
				"localName": "div"
			},
			{
				"ID": "main",
				"localName": "main"
			},
			{
				"ID": "",
				"localName": "article"
			},
			{
				"ID": "article_sector",
				"localName": "div"
			},
			{
				"ID": "",
				"localName": "div"
			},
			{
				"ID": "",
				"localName": "div"
			},
			{
				"ID": "article_body",
				"localName": "body"
			},
			{
				"ID": "",
				"localName": "html"
			},
			{},
			{}
		]
	},
	"reporter": "fbb17c21-db73-4dc3-a66d-2ab819022aad",
	"type": "PaywallInPage",
	"url": "https://www.wsj.com/articles/miami-area-condo-collapse-sparks-calls-for-tighter-laws-11625922002?mod=hp_lead_pos7"
}

baseValidator(report.url, a => {console.log(a); return 'hi'}, report.content)