module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    lambda_package: {
      default: {}
    },
    lambda_deploy: {
      default: {
        arn: 'arn:aws:lambda:us-east-2:656366925447:function:ccc-aws-helloworld',
        options: {
          region: 'us-east-2'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-aws-lambda');

  // Default task(s).
  grunt.registerTask('default', ['lambda_package']);
};
