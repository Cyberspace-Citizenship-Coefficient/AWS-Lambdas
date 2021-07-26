"use strict";

const uuid = require('uuid');
const BaseDAO = require('./base').BaseDAO;

const defaultTableName = 'devices';

/* export */ class DeviceDAO extends BaseDAO {
    constructor(configuration) {
        super(configuration, defaultTableName);
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
        return dynamo
            .getItem(parameters).promise()
            .then(data => {
                console.log('data');
                console.log(data);
                resolve(data);
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

        return dynamo
            .putItem(parameters).promise()
            .then(data => deviceId);
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
