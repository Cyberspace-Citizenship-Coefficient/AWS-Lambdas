"use strict";

const db = require('./db.js');
const DefaultConnectionFactory = db.DefaultConnectionFactory;

//import { DefaultConnectionFactory } from "./db";

/* export */ class InfractionDAO {
    constructor(connectionFactory) {
        this.connectionFactory = connectionFactory;
    }

    /**
     * Returns a connection from the connection factory.
     */
    async getConnection() {
        return this.connectionFactory.getConnection();
    }

    /**
     * Stores a new infraction into the database.
     * @param infraction the infraction
     * @returns {Promise<void>}
     */
    async put(infraction) {
       let statementParameters = [
            infraction.id,         // id
            infraction.reporter,   // reporter
            infraction.timestamp,  // timestamp
            infraction.url,        // url
            infraction.type,       // type
            infraction.content     // content
        ];

        let statement = 'INSERT INTO Infractions(?,?,?,?,?,?)';

        try {
            let connection = await this.getConnection();
            let result = await connection.query(statement, statementParameters);
            console.log(result);
        } catch(err) {
            console.log('error');
            console.log(err);
            throw err;
        }
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
