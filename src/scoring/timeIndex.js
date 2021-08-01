'use strict';

const _ = require('lodash')
const common = require('ccc-aws-common');

const bucketName = 'ccc-indexed-bucket'

class TimeIndexDAO {
    async get(timeIndex) {
        const s3client = await common.s3.getClient();
        const indexBlock = Math.floor(timeIndex / 100)
        const indexKey = 'timeIndex/' + indexBlock + '/' + timeIndex
        const params = {Bucket: bucketName, Key: indexKey}

        await s3client.getObject(params).promise()
            .then(data => {
                console.log(data);
            });
    }

    async put(timeIndex, timeIndexData) {
        const s3client = await common.s3.getClient();
        const indexBlock = Math.floor(timeIndex / 100)
        const indexKey = 'timeIndex/' + indexBlock + '/' + timeIndex
        const params = {
            Bucket: bucketName,
            Key: indexKey,
            ContentType: 'application/json',
            Body: JSON.stringify(timeIndexData)
        }

        await s3client.putObject(params).promise()
            .then(data => {
                console.log(data);
            });
    }
}

function buildTimeIndex(scoresForTimeIndex) {
    const scoreByIndexAndHost = _.groupBy(scoresForTimeIndex, 'host')
    const timeIndex = _.map(scoreByIndexAndHost, (scores, site) => {
        // the overall score for this 'site' is a function of the aggregate scores (across types and instances)
        const overall = _.reduce(scores, (accum, score) => accum + parseInt(score.value), 0);
        const byType = scores.map(score => ({ type: score.type, value: score.value }))
        // output the overall score and the score by type
        return { site: site, score: overall, byType: byType }
    })

    return timeIndex
}

function buildTimeIndices(scores) {
    const timeIndexDao = new TimeIndexDAO()
    const scoreByIndex = _.forEach(_.groupBy(scores, 'timeIndex'))
    return Promise.all(_.map(scoreByIndex, (scores, timeIndex) => {
        const timeIndexData = buildTimeIndex(scores)
        return timeIndexDao.put(timeIndex, timeIndexData)
    }));
}

function buildAll() {
    //fs.readFile('scores.json', 'utf-8', function(err, data) {
    //    buildTimeIndices(JSON.parse(data));
    //});

    return common.dao.scoring.Singleton.getInstance()
        .list()
        .then(async (scores) => buildTimeIndices(scores));

}

module.exports = {
    TimeIndexDAO : TimeIndexDAO,
    buildTimeIndex : buildTimeIndex,
    buildTimeIndices : buildTimeIndices,
    buildAll : buildAll
}