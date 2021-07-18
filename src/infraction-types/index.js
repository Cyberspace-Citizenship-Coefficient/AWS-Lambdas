exports.handler = async(event) => {
    const infractionTypes = [{
        title: "Report Ad with Audio",
        id: "AdWithAudio"
    }, {
        title: "Report Paywall in middle of page",
        id: "PaywallInPage"
    }, {
        title: "Site Uses HTTP not HTTPS",
        id: "httpNotHttps"
    }];
    const response = {
        statusCode: 200,
        body: JSON.stringify(infractionTypes)
    };
    return response;
};
