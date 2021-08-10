#!/usr/bin/node node
"use strict";

//https://stackoverflow.com/questions/9437228/html5-check-if-audio-is-playing#answer-46117824
//https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#attr-autoplay
var isPlaying = function (ele) {
    return (ele.currentTime > 0
        && !ele.paused
        && !ele.ended
        && ele.readyState > 2) || ele.autoplay;
}

exports.mutate = (infraction) => {
	return infraction
}

// TODO: Prove that it is an AD and not, like, youtube
exports.validate = (document, elementToValidate) => {
	if (isPlaying(elementToValidate)) {
		return elementToValidate.muted;
	} else {
		let subElements = elementToValidate.getElementsByTagName("*")
		for (const subEle of subElements) {
			if (isPlaying(subEle)) {
				return subEle.muted;
			}
		}			
	}
	return false;
}

