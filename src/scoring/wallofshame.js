#!/usr/bin/env node

const _ = require('lodash')
const common = require('ccc-aws-common');
const timeIndex = require('./timeIndex')

const minute = 1440000; // milliseconds in one minute
const boundary = minute * 15;

const segmentsPerWeek = 96;
const maxDecay = segmentsPerWeek * 4;

const scoreMultiplier = 100;

async function build(referenceTimeInMillis) {
    const scoreOverall = {}
    const scoreByType = {}

    const referenceTimeIndex = Math.floor(referenceTimeInMillis / boundary);
    const timeIndexDao = new timeIndex.TimeIndexDAO()
    await timeIndexDao.visit(function(timeIndex, timeIndexData) {
        const indexDelta = referenceTimeIndex - timeIndex;
        if (indexDelta >= 0 && indexDelta < maxDecay) {
            let indexDecay = 1.0 - indexDelta / maxDecay;
            _.forEach(timeIndexData, function(value) {
                let indexForSite = scoreOverall[value.site];
                if (indexForSite === undefined) {
                    scoreOverall[value.site] = indexForSite = {
                        site: value.site,
                        score: 0
                    }
                }

                indexForSite.score += value.score * indexDecay * scoreMultiplier

                _.forEach(value.byType, function(typeValue) {
                    let scoreType = typeValue.type
                    let scoreValue = parseInt(typeValue.value)
                    let scoreForType = scoreByType[scoreType]
                    if (scoreForType === undefined) {
                        scoreByType[scoreType] = scoreForType = {}
                    }

                    let scoreForTypeAndSite = scoreForType[value.site]
                    if (scoreForTypeAndSite === undefined) {
                        scoreForType[value.site] = 0
                    }

                    scoreForType[value.site] += scoreValue * indexDecay * scoreMultiplier
                });
            })
        }
    });

    // overall wall of shame

    const aggregateList = _.values(scoreOverall)
    const overallList = _.take(_.orderBy(aggregateList, 'score', 'desc'), 20)
    const overallWoS = {
        "sites" : overallList
    }

    await common.dao.wallOfShame.put('current/overall', overallWoS)

    // type specific wall of shame

    await _.map(scoreByType, async function(scoreForType, scoreType) {
        const typeAggregateList = _.map(scoreForType, (value, key) => ({'site': key, 'score': value}))
        const typeList = _.take(_.orderBy(typeAggregateList, 'score', 'desc'), 20)
        const typeWoS = {
            "sites" : typeList
        }
        await common.dao.wallOfShame.put('current/type/' + scoreType, typeWoS)
    });
}

module.exports = {
    build: function() {
        return build(Date.now()).catch(error => console.log('ERROR:' + error));
    }
}

