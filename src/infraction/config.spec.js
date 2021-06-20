'use strict';

const expect = require('chai').expect;
const config = require('./config');

describe('Configuration ', function () {
    it('resolve database password', async function () {
        if (process.env.WITH_AWS_TESTS) {
            let password = await config.db.password();
            expect(password).to.exist;
        }
    });

    it('resolve database host', async function () {
        if (process.env.WITH_AWS_TESTS) {
            let hostname = await config.db.host();
            expect(hostname).to.exist;
        }
    });
});
