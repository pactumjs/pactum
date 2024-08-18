const config = require('../config');
const helper = require('../helpers/helper');
const { PactumRequestError } = require('../helpers/errors');

const records = [];

const request = {

  setDefaultHeaders(key, value) {
    if (!key) {
      throw new PactumRequestError(`Invalid header key provided - ${key}`);
    }
    if (typeof key === 'string') {
      config.request.headers[key] = value;
    } else {
      if (!helper.isValidObject(key)) {
        throw new PactumRequestError(`Invalid headers provided - ${key}`);
      }
      Object.assign(config.request.headers, key);
    }
  },

  setBasicAuth(username, password) {
    config.request.headers['Authorization'] = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
  },

  setBearerToken(token) {
    config.request.headers['Authorization'] = 'Bearer ' + token;
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

  setDefaultFollowRedirects(follow) {
    if (typeof follow !== 'number' && typeof follow !== 'boolean') {
      throw new PactumRequestError(`Invalid follow redirect option - ${follow}, allowed boolean/number`);
    }
    if (typeof follow == 'number' && follow >=0 ) {
      config.request.followRedirects.count = follow;
    }
    config.request.followRedirects.enabled = follow;
  },

  removeDefaultHeaders(key) {
    if(key) {
      delete config.request.headers[key];
    } else {
      config.request.headers = {};
    } 
  },

  setDefaultRecorders(name, path) {
    records.push({ name, path });
  },

  getDefaultRecorders() {
    return records;
  }

};

module.exports = request;