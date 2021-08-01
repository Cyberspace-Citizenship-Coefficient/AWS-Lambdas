#!/usr/bin/node node
"use strict";

const puppeteer = require('puppeteer');
class Validator {
    async validate(infraction) {
    }
}

class CoreValidator extends Validator {
	getValidator(infractionType) {
		let validator = {
			mutate: a => a,
			validate: b => false
		}
		switch (infractionType) {
			case 'httpNotHttps':
				validator = require('./specificValidators/https.js')
				break;
			case 'AdWithAudio':
				validator = require('./specificValidators/audio.js')
				break;
		}
		
		return validator
	}
	
    async validate(infraction) {
	    console.log('validation: validating infraction of type ' + infraction.type);
		const validator = this.getValidator(infraction.type);
		if (validator.mutate) {
			infraction = await validator.mutate(infraction);
		}
		
        let URL = infraction.url;
        let reportedElement = infraction.content;
        let browser, page;

        browser = await puppeteer.launch({
            args: [
                "--no-sandbox",
                "--start-fullscreen"
            ],
            ignoreHTTPSErrors: true,
            headless: true,
			ignoreDefaultArgs: [
				"--mute-audio"
			]
        });

        console.log('validation: browser created');

        let result = '';
        try {
            page = await browser.newPage();
            console.log('validation: directing browser to ' + URL);
            await page.goto(URL, {waitUntil: 'networkidle0'});
            await page.exposeFunction('VALIDATE', validator.validate);

            console.log('validation: invoking page evaluation');
            result = await page.evaluate(async (badElement) => {
                console.log('validation: invoking page evaluation callback');
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
            result = false
        }

        browser.close();
        return result
    }
}

exports.Validator = Validator;
exports.CoreValidator = CoreValidator;
exports.Singleton = (function(){
    var instance;
    return {
        setInstance : function(value) {
            instance = value;
        },
        getInstance : function(){
            if(!instance) {  // check already exists
                instance = new CoreValidator();
            }
            return instance;
        }
    }
})();

