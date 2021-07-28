#!/usr/bin/node node
"use strict";

exports.mutate = (infraction) => {
	infraction.url = infraction.url.replace('https','http')
	
	return infraction
}

exports.validate = (document, elementToValidate) => {
	if (document.location.href.includes('http://')) {
		return true
	}
	return false
}
