'use strict';

const singleton = require('../singleton');
const BaseDAO = require('./base').BaseDAO;

const defaultTableName = process.env.TBL_SCORING || 'scoring';

class ScoringDAO extends BaseDAO {
    constructor(configuration) {
        super(configuration, defaultTableName);
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