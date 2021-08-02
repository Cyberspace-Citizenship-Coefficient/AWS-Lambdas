# Validate 
## [Base Validator](./base_validator.js)
Uses puppeteer to load a webpage then find the reported infraction.
Once loaded, the specific validator is called to return an boolean to see if the infraction can be validated or not. 

## [Specific Validators](./specificValidators)
Each specific validator exports two functions.
1) mutate
	- This fucntion is used to change the infraction before loading
		- EX: Https -> http url
1) validate 
	- This function is passed the element to valudate and is called in the context of the page 
	- It returns true if it can find the infraction in that element or it's children
	
## Creating more validators
1) Create a new specific validator using the below template
1) Add an [infraction type](./../infraction-types/index.js) for your validator 
1) Add the validator to the [Base Validator's](./base_validator.js) getValidator function.

### Specific Validator Template
```javascript
#!/usr/bin/node node
"use strict";

exports.mutate = (infraction) => {	
	return infraction
}

exports.validate = (elementToValidate) => {
	return false
}
```