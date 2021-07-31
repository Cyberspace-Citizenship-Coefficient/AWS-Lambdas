'use strict';

const ScoringAlgorithm = require('./algo')

const minute = 1440000; // milliseconds in one minute
const boundary = minute * 15;

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

        if (timestamp instanceof Date) {
            timestamp = timestamp.getTime();
        } else if (typeof(timestamp) == 'string') {
            timestamp = Date.parse(timestamp);
        } else {
            console.log('timestamp type: ' + typeof(timestamp));
        }

        score.timeIndex = Math.floor(timestamp / boundary);
        return score;
    }
}

module.exports = MarginalScoringAlgorithm;