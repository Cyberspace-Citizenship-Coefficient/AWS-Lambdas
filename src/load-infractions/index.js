exports.handler = async (event) => {
	// ToDo - Adjust this list by the USER/Instance based on a trust model
    return {
        statusCode: 200,
        body: JSON.stringify(
			[{
				title: "Report Ad with Audio",
				id:  "AdWithAudio"
			},{
				title: "Report Paywall in middle of page",
				id:  "PaywallInPage"
			}]
		)
    };
};