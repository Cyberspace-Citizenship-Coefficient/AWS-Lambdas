exports.handler = async (event) => {
    // Returns "helloworld" back to the caller.  This is just designed to
    // be a dumb test endpoint that can be triggered as a lambda.
    return {
        statusCode: 200,
        body: JSON.stringify('Hello world')
    };
};