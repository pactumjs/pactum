const config = require('../config');
const helper = require('../helpers/helper');
const { PactumResponseError } = require('../helpers/errors');


const response = {

  setDefaultExpectHeaders(key, value) {
    if (!key) {
      throw new PactumResponseError(`Invalid expected response header key provided - ${key}`);
    }
    if (typeof key === 'string') {
      config.response.headers[key] = value;
    } else {
      if (!helper.isValidObject(key)) {
        throw new PactumResponseError(`Invalid expected response headers provided - ${key}`);
      }
      Object.assign(config.response.headers, key);
    }
  },

  setDefaultExpectResponseTime(respTime) {
    if (typeof respTime !== 'number') {
      throw new PactumResponseError(`Invalid expected response time provided - ${respTime}`);
    }
    config.response.time = respTime;
  },

  setDefaultExpectStatus(status) {
    if (typeof status !== 'number' || 100 > status || status > 599) {
      throw new PactumResponseError(`Invalid expected response status provided - ${status}`);
    }
    config.response.status = status;
  },

  setDefaultExpectHandlers(handler, data) {
    config.response.expectHandlers.push({ handler, data });
  },

  removeDefaultExpectHeader(key) {
    if (!key) {
      throw new PactumResponseError(`Invalid expected response header key provided - ${key}`);
    }
    delete config.response.headers[key];
  },

  removeDefaultExpectHeaders() {
    config.response.headers = {};
  },

  removeDefaultExpectHandlers() {
    config.response.expectHandlers = [];
  }

};

module.exports = response;