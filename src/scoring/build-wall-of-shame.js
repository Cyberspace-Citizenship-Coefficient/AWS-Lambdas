#!/usr/bin/env node

const common = require('ccc-aws-common')
const wallofshame = require('./wallofshame')

wallofshame.build()
    .catch(error => {
        console.log('ERROR: ' + error);
    })

