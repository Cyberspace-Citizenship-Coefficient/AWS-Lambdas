"use strict";

const uuid = require('uuid');
const common = require('ccc-aws-lambda-common');

const defaultTableName = process.env.TBL_INFRACTIONS || 'infractions';

function DataValidationException(message) {
    const error = new Error(message);
    return error;
}
DataValidationException.prototype = Object.create(Error.prototype);

function stringValidator(element) {
    let value = element.S;
    if (value) {
        return value;
    }

    throw new DataValidationException('expected string, but received ' + JSON.stringify(element));
}

function getAttribute(item, name, typeValidator, missingHandler) {
    let element = item[name];
    if (element) {
        return typeValidator(element);
    }

    return missingHandler();
}

function optionalAttribute(item, name, typeValidator) {
    return getAttribute(item, name, typeValidator, () => undefined);
}

function requiredAttribute(item, name, typeValidator) {
    return getAttribute(item, name, typeValidator, () => {
        throw new DataValidationException('missing required element ' + name);
    });
}

function requiredString(item, name) {
    return requiredAttribute(item, name, stringValidator);
}

/* export */ class InfractionDAO {
    constructor(configuration) {
        if (configuration !== undefined) {
            this.dynamodb = configuration.dynamodb;
            this.tableName = configuration.tableName;
        }
        if (!this.tableName) {
            this.tableName = defaultTableName;
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
            TableName: this.tableName,
            Key: {"id": {"S": id}}
        }

        let dynamo = await this.client();

        return new Promise((resolve, reject) => {
            dynamo.getItem(parameters, function(err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    // Expected return value (if found):
                    // {
                    //   Item: {
                    //     content: { S: '{}' },
                    //     reporter: { S: 'test-reporter' },
                    //     id: { S: '4da4815b-57e1-4d10-8a2f-c70c88265474' },
                    //     url: { S: 'test-url' },
                    //     type: { S: 'test-type' },
                    //     timestamp: { S: '2021-06-27T21:53:17.784Z' }
                    //   }
                    // }

                    let itemData = data.Item;
                    if (itemData) {
                        let content = optionalAttribute(itemData, 'content', stringValidator);
                        if (content) {
                            content = JSON.parse(content);
                        }

                        let item = {
                            id: requiredString(itemData, 'id'),
                            reporter: requiredString(itemData, 'reporter'),
                            url: requiredString(itemData, 'url'),
                            type: requiredString(itemData, 'type'),
                            timestamp: requiredString(itemData, 'timestamp'),
                            content: content
                        };

                        resolve(item);
                    } else {
                        resolve(undefined);
                    }
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
        let infractionId = uuid.v4();
        let timestamp = (new Date()).toISOString();
        let content = infraction.content;
        if (content) {
            content = JSON.stringify(content);
        }

        let dynamoItem = {
            "id": {"S": infractionId},
            "reporter": {"S": infraction.reporter},
            "timestamp": {"S": timestamp},
            "url": {"S": infraction.url},
            "type": {"S": infraction.type},
            "content": {"S": content}
        };

        let parameters = {
            TableName: this.tableName,
            Item: dynamoItem
        };

        return new Promise((resolve, reject) => {
            dynamo.putItem(parameters, function(err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve({
                        id: infractionId,
                        timestamp: timestamp,
                        result: data
                    });
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
                instance = new InfractionDAO();
            }
            return instance;
        }
    }
})();
