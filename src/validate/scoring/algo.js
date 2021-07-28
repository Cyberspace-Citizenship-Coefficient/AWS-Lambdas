'use strict';

/* export */ class ScoringAlgorithm {
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

module.exports = ScoringAlgorithm
