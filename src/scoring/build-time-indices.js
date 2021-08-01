#!/usr/bin/env node

const common = require('ccc-aws-common')
const timeIndex = require('./timeIndex')

timeIndex.buildAll()
    .catch(error => {
        console.log('ERROR: ' + error);
    })

