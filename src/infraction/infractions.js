"use strict";

const common = require('ccc-aws-lambda-common');

const tableName = 'infractions';

/* export */ class InfractionDAO {
    constructor(configuration) {
        if (configuration !== undefined) {
            this.dynamodb = configuration.dynamodb;
        }
    }

    async client() {
        if (this.dynamodb === undefined) {
            this.dynamodb = await common.db.dynamodb.getClient();
        }
        return this.dynamodb;
    }

    /**
     * Retrieves an infraction from the datastore.
     * @param id the infraction id.
     * @returns {object}
     */

    async get(id) {
        let parameters = {
            TableName: tableName,
            Key: { "id" : id }
        }

        let dynamo = await this.client();

        return new Promise((resolve, reject) => {
            dynamo.get(parameters, function(err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log('data');
                    console.log(data);
                    resolve(data);
                }
            });
        });
    }

    /**
     * Stores a new infraction into the database.
     * @param infraction the infraction
     * @returns {Promise<void>}
     */
    async put(infraction) {
        let dynamo = await this.client();
        let dynamoItem = {
            "id": {"S": infraction.id},
            "reporter": {"S": infraction.reporter},
            "timestamp": {"S": infraction.timestamp},
            "url": {"S": infraction.url},
            "type": {"S": infraction.type},
            "content": {"S": infraction.content}
        };

        let parameters = {
            TableName: tableName,
            Item: dynamoItem
        };

        return new Promise((resolve, reject) => {
            dynamo.putItem(parameters, function(err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

exports.InfractionDAO = InfractionDAO;
exports.Singleton = (function(){
    var instance;
    return {
        setInstance : function(value) {
            instance = value;
        },
        getInstance : function(){
            if(!instance) {  // check already exists
                instance = new InfractionDAO(new DefaultConnectionFactory());
            }
            return instance;
        }
    }
})();
