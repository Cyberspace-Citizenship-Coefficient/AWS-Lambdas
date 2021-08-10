exports.sampleInfractionId = "02cdac41-7919-4d33-b8c0-0f977b9e6794";
exports.sampleInfractionReporter = "4df516cf-4065-45a3-8259-dc8ae9acc596";
exports.sampleInfractionType = "PaywallInPage";
exports.sampleInfractionUrl = "https://qctimes.com/path1/path2";
exports.sampleInfractionHost = "qctimes.com";
exports.sampleInfractionPath = "path1/path2";

exports.sampleMessage = {
    "id": exports.sampleInfractionId,
    "reporter": exports.sampleInfractionReporter,
    "url":exports.sampleInfractionUrl,
    "type":exports.sampleInfractionType,
    "timestamp":"2021-06-29T00:47:38.109Z",
    "content":{
        "outerHTML":"<div class=\"title\">Please register or log in to keep reading</div>",
        "path":[
            {"ID":"","localName":"div"},
            {"ID":"","localName":"div"},
            {"ID":"","localName":"div"},
            {"ID":"","localName":"div"},
            {"ID":"","localName":"div"},
            {"ID":"lee-registration-wall-modal","localName":"div"},
            {"ID":"lee-registration-wall","localName":"div"},
            {"ID":"","localName":"body"},
            {"ID":"","localName":"html"},
            {},
            {}
        ]
    }
}

exports.sampleTopicArn = 'arn:aws:sns:us-east-2:xxxxx:ccc_validator_topic';
exports.sampleBody = JSON.stringify({
    Type: 'Notification',
    MessageId: 'c9506599-1967-58b0-a040-3cfc79b5e588',
    TopicArn: exports.sampleTopicArn,
    Message: JSON.stringify(exports.sampleMessage),
    Timestamp: '2021-07-11T21:11:46.879Z'
});

exports.sampleTimeIndex = 1000;

exports.sampleScore = {
    timeIndex: exports.sampleTimeIndex,
    infraction: exports.sampleInfractionId,
    type: exports.sampleInfractionType,
    host: exports.sampleInfractionHost,
    path: exports.sampleInfractionPath,
    value: 1
};