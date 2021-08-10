"use strict";

const common = require('ccc-aws-common');

// the AWS topic (SNS) that will receive validation requests
let defaultValidationTopic = process.env.ARN_TOPIC_VALIDATION || 'validation_topic';

class Validator {
    constructor(configuration) {
        if (configuration !== undefined) {
            this.sns = configuration.sns;
            this.validationTopicArn = configuration.validationTopicArn;
        }

        if (!this.validationTopicArn) {
            this.validationTopicArn = defaultValidationTopic;
        }

        if (!this.validationTopicArn) {
            throw new Error('Missing validation topic ARN');
        }
    }

    async client() {
        if (this.sns === undefined) {
            this.sns = await common.sns.sns.getClient();
        }
        return this.sns;
    }

    /**
     * Initiates the validation of an infraction.
     * @param infraction the infraction object.
     */

    async validate(infraction) {
        let sns = await this.client();
        let parameters = {
            Message: JSON.stringify(infraction),
            TopicArn: this.validationTopicArn
        }

        return new Promise((resolve, reject) => {
            sns.publish(parameters, function(err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
		    console.log('Successful delivery to topic');
                    resolve(undefined);
                }
            });
        });
    }
}

exports.Validator = Validator;
exports.Singleton = (function(){
    var instance;
    return {
        setInstance : function(value) {
            instance = value;
        },
        getInstance : function(){
            if(!instance) {  // check already exists
                instance = new Validator();
            }
            return instance;
        }
    }
})();
