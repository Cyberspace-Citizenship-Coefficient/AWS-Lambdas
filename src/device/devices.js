"use strict";

const uuid = require('uuid');
const common = require('ccc-aws-lambda-common');

const defaultTableName = 'devices';

/* export */ class DeviceDAO {
    constructor(configuration) {
        if (configuration !== undefined) {
            this.dynamodb = configuration.dynamodb;
        }
    }

    async client() {
        if (this.dynamodb === undefined) {
            this.dynamodb = await common.db.dynamodb.getClient();
            this.tableName = configuration.tableName;
        }
        if (!this.tableName) {
            this.tableName = defaultTableName;
        }
        return this.dynamodb;
    }

    /**
     * Retrieves a device from the datastore.
     * @param id the device id.
     * @returns {object}
     */

    async get(id) {
        let parameters = {
            TableName: this.tableName,
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
     * Stores a new device into the database.
     * @param device the device details.
     * @returns {Promise<void>}
     */
    async put(device) {
        let dynamo = await this.client();
        let deviceId = uuid.v4();

        let deviceAsItem = {
            "id": {
                "S": deviceId
            },
            "timestamp": {
                "S": (new Date()).toISOString()
            },
        };

        if (device.source_ip !== undefined) {
            deviceAsItem.source_ip = {
                "S" : device.source_ip
            };
        }

        let parameters = {
            TableName: this.tableName,
            Item: deviceAsItem
        };

        return new Promise((resolve, reject) => {
            dynamo.putItem(parameters, function(err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(deviceId);
                }
            });
        });
    }
}

exports.DeviceDAO = DeviceDAO;
exports.Singleton = (function(){
    var instance;
    return {
        setInstance : function(value) {
            instance = value;
        },
        getInstance : function(){
            if(!instance) {  // check already exists
                instance = new DeviceDAO();
            }
            return instance;
        }
    }
})();
