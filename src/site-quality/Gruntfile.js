/* the target AWS region */
let region = process.env.AWS_REGION;
if (region === undefined) {
  throw new Error("please define the AWS region")
}
/* the target AWS account */
let account = process.env.AWS_ACCOUNT;
if (account === undefined) {
  throw "please define the AWS account";
}
/* The name of the lambda function */
let functionName = process.env.LAMBDA_FUNCTION_NAME || "ccc-aws-site-quality";
/* The ARN of the lambda function */
let functionArn = 'arn:aws:lambda:' + region + ':' + account + ':function:' + functionName;

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    lambda_package: {
      default: {}
    },
    lambda_deploy: {
      default: {
        arn: functionArn,
        options: {
          region: region
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-aws-lambda');

  grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy'])

  // Default task(s).
  grunt.registerTask('default', ['deploy']);
};
