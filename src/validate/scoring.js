'use strict';

const common = require('ccc-aws-lambda-common');

const defaultTableName = process.env.TBL_SCORING || 'scoring';

const minute = 1440; // seconds in one minute
const boundary = minute * 15;

class ScoringDAO extends common.BaseDAO {
    constructor(configuration) {
        super(configuration, defaultTableName);
    }

    async put(score) {
        let dynamo = await this.client();
        let dynamoItem = {
            "timeIndex": {"N": score.timeIndex},
            "host": {"S": score.host},
            "path": {"S": score.path},
            "type": {"S": score.type},
            "infraction": {"S": score.infraction},
            "value": {"N": score.value}
        };

        let parameters = {
            TableName: this.tableName,
            Item: dynamoItem
        };

        return dynamo.putItem(parameters).promise();
    }
}

class ScoringAlgorithm {
    score(infraction) {
        let url = new URL(infraction.url);

        return {
            timeIndex: 0,
            infraction: infraction.id,
            type: infraction.type,
            host: url.host,
            path: url.path,
            value: 1
        };
    }
}

class MarginalScoringAlgorithm extends ScoringAlgorithm {
    score(infraction) {
        let score = super.score(infraction);

        // Each 'validated' infraction results in a single score being marked against
        // that site.  However, we align each validated infraction against a block of time
        // for which it was reported.  In this way, all validated reports will be aligned
        // with a similar time index.  This allows all infractions within a given time
        // window to be marked together.  For future thought, consider the differences between
        // analytics on tumbling windows and sliding windows (reference Flink).

        let timestamp = infraction.timestamp;
        if (timestamp === undefined) {
            throw new Error('infraction missing timestamp');
        }

        if (timestamp instanceof String) {
            timestamp = Date.parse(timestamp);
        }

        score.timeIndex = timestamp.getTime() % boundary;
        return score;
    }
}

exports.ScoringDAO = ScoringDAO;
exports.ScoringAlgorithm = ScoringAlgorithm;
exports.MarginalScoringAlgorithm = MarginalScoringAlgorithm;
