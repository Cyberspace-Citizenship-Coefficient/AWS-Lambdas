'use strict';

const db = require('../db');
const singleton = require('../singleton');
const BaseDAO = require('./base').BaseDAO;
const validation = db.validation;

const defaultTableName = process.env.TBL_SCORING || 'scoring';

function itemToScore(itemData) {
    return {
        infraction: validation.requiredString(itemData, 'infraction'),
        value: validation.requiredNumber(itemData, 'value'),
        timeIndex: validation.requiredNumber(itemData, 'timeIndex'),
        host: validation.requiredString(itemData, 'host'),
        type: validation.requiredString(itemData, 'type')
    };
}

class ScoringDAO extends BaseDAO {
    constructor(configuration) {
        super(configuration, defaultTableName);
    }

    async list(continuationId) {
        let dynamo = await this.client();
        let parameters = { TableName: this.tableName };
        return dynamo
            .scan(parameters).promise()
            .then(result => result.Items.map(itemData => itemToScore(itemData)));
    }

    async put(score) {
        let path = score.path || '';
        let dynamo = await this.client();
        let parameters = {
            TableName: this.tableName,
            Key: {
                "timeIndex": {"N": score.timeIndex.toString()},
                "host": {"S": score.host}
            },
            UpdateExpression: 'SET #attrType = :type, infraction = :infraction, #attrValue = :value',
            ExpressionAttributeNames: {
                '#attrType': 'type',
                '#attrValue': 'value'
            },
            ExpressionAttributeValues: {
                ":type": { "S" : score.type },
                ":infraction": { "S" : score.infraction },
                ":value": { "N" : score.value.toString() }
            }
        };

        return dynamo.updateItem(parameters).promise();
    }
}

exports.ScoringDAO = ScoringDAO;
exports.Singleton = singleton(() => new ScoringDAO())