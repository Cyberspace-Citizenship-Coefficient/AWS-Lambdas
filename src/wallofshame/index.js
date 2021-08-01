#!/usr/bin/node node
"use strict";

const vandium = require('vandium');
const common = require('ccc-aws-common');

exports.handler = vandium.api()
    .GET()
    .validation({
        pathParameters: {
            type: 'string'
        }
    })
    .handler(async (event) => {
        let type = event.pathParameters.type;
        if (type === undefined) {
            let overallWoS = await common.dao.wallOfShame.get('current/overall');
            return JSON.stringify(overallWoS);
        }

        let typeWoS = await common.dao.wallOfShame.get('current/type/' + type);
        return JSON.stringify(typeWoS);
    })
