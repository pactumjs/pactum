const form = require('form-data');

const config = require('../config');
const { PactumRequestError } = require('../helpers/errors');

const request = {

  FormData: form,

  /**
   * adds a default header to all the requests
   * @param {string} key - header key
   * @param {string} value - header value
   */
  setDefaultHeader(key, value) {
    if (!key) {
      throw new PactumRequestError(`Invalid header key provided - ${key}`);
    }
    config.request.headers[key] = value;
  },

  /**
   * sets a default timeout to all the requests
   * Default is 3000ms
   * @param {number} timeout - timeout in milliseconds
   */
  setDefaultTimeout(timeout) {
    if (typeof timeout !== 'number') {
      throw new PactumRequestError(`Invalid timeout provided - ${timeout}`);
    }
    config.request.timeout = timeout;
  },

  /**
   * sets base url
   * @param {string} url - base url
   */
  setBaseUrl(url) {
    if (typeof url !== 'string') {
      throw new PactumRequestError(`Invalid base url provided - ${url}`);
    }
    config.request.baseUrl = url;
  }

};

module.exports = request;