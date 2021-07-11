"use strict";

const common = require('ccc-aws-lambda-common');

// the AWS topic (SNS) that will receive validation requests
let defaultValidationTopic = process.env.TOPIC_VALIDATION || 'validation_topic';

class Validator {
    constructor(configuration) {
        if (configuration !== undefined) {
            this.sns = configuration.sns;
            this.validationTopic = configuration.validationTopic;
        }

        if (!this.validationTopic) {
            this.validationTopic = defaultValidationTopic;
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
            TopicArn: this.validationTopic
        }

        return new Promise((resolve, reject) => {
            sns.publish(parameters, function(err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
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
