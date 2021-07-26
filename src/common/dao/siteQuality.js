"use strict";

const BaseDAO = require('./base').BaseDAO;
const validation = require('../db').validation;

const defaultTableName = process.env.TBL_SITE_QUALITY || 'site-quality';

/* Make sure this table is in inverted order by score */
const ratingsTable = [
    { score: 60, value: 'bad' },
    { score: 20, value: 'iffy' },
    { score: 0, value: 'good' }
]

const ratingUnknown = 'unknown';

/**
 * Site rating is an interpretation of the score.  And this can be improved over time
 * to reflect more interestingly subjective interpretations of a site score.
 */

function getRating(quantitativeScore) {
    for (let ii = 0; ii < ratingsTable.length; ii++) {
        let rating = ratingsTable[ii];
        if (quantitativeScore >= rating.score) {
            return rating.value
        }
    }

    throw Error('invalid score')
}

class SiteQualityDAO extends BaseDAO {
    constructor(configuration) {
        super(configuration, defaultTableName);
    }

    async get(site) {
        let parameters = {
            TableName: this.tableName,
            Key: {'site': {"S": site}}
        }

        let dynamo = await this.client()
        return dynamo
            .getItem(parameters).promise()
            .then(data => {
                let itemData = data.Item;
                if (itemData) {
                    let siteValue = validation.requiredNumber(itemData, 'value')
                    let siteRating = getRating(siteValue);
                    return {
                        site: site,
                        value: siteValue,
                        rating: siteRating
                    }
                }

                return {
                    site: site,
                    rating: ratingUnknown
                };
            });
    }

    async put(siteQualityArtifact) {
        let dynamoItem = {
            "site": {"S": siteQualityArtifact.site},
            "value": {"N": siteQualityArtifact.value}
        };

        let parameters = {
            TableName: this.tableName,
            Item: dynamoItem,
            ConditionExpression: 'attribute_not_exists(site)'
        };

        let dynamo = await this.client()
        return dynamo
            .putItem(parameters)
            .promise();
    }
}

exports.SiteQualityDAO = SiteQualityDAO;
exports.Singleton = (function(){
    var instance;
    return {
        setInstance : function(value) {
            instance = value;
        },
        getInstance : function(){
            if(!instance) {  // check already exists
                instance = new SiteQualityDAO();
            }
            return instance;
        }
    }
})();
