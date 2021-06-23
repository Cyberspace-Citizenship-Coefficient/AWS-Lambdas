const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
    // Returns a UUID to be used to identify the instance of the plugin
    return {
        statusCode: 200,
        body: JSON.stringify(uuidv4())
    };
};