const form = require('form-data');

const config = require('../config');
const helper = require('../helpers/helper');
const { PactumRequestError } = require('../helpers/errors');

const request = {

  FormData: form,

  setDefaultHeader(key, value) {
    if (!key) {
      throw new PactumRequestError(`Invalid header key provided - ${key}`);
    }
    config.request.headers[key] = value;
  },

  setDefaultHeaders(headers) {
    if (!helper.isValidObject(headers)) {
      throw new PactumRequestError(`Invalid headers provided - ${headers}`);
    }
    Object.assign(config.request.headers, headers);
  },

  setDefaultTimeout(timeout) {
    if (typeof timeout !== 'number') {
      throw new PactumRequestError(`Invalid timeout provided - ${timeout}`);
    }
    config.request.timeout = timeout;
  },

  setBaseUrl(url) {
    if (typeof url !== 'string') {
      throw new PactumRequestError(`Invalid base url provided - ${url}`);
    }
    config.request.baseUrl = url;
  },

  removeDefaultHeader(key) {
    if (!key) {
      throw new PactumRequestError(`Invalid header key provided - ${key}`);
    }
    delete config.request.headers[key];
  },

  removeDefaultHeaders() {
    config.request.headers = {};
  }

};

module.exports = request;