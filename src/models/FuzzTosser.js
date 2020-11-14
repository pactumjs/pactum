const phin = require('phin');
const fuzzCore = require('openapi-fuzzer-core');
const log = require('../helpers/logger');
const rp = require('../helpers/requestProcessor');
const helper = require('../helpers/helper');

const BASE_URL_PATTERN = /^https?:\/\/[^\/]+/i;

class Tosser {

  constructor(fuzz) {
    this.fuzz = fuzz;
    this.baseUrl = '';
    this.requests = [];
    this.responses = [];
  }

  async toss() {
    const data = await this.getSwaggerJson();
    this.requests = fuzzCore.swagger(data);
    this.setBaseUrl();
    await this.sendRequestsAndValidateResponses();
  }

  async getSwaggerJson() {
    const request = rp.process({ method: 'get', url: this.fuzz.swaggerUrl });
    request.parse = 'json';
    const response = await phin(request);
    return response.body;
  }

  setBaseUrl() {
    const matches = this.fuzz.swaggerUrl.match(BASE_URL_PATTERN);
    if (matches) {
      this.baseUrl = matches[0];
    }
  }

  async sendRequestsAndValidateResponses() {
    let requests = [];
    let promises = [];
    let responses = [];
    let count = 0;
    for (let i = 0; i < this.requests.length; i++) {
      count = count + 1;
      const request = this.requests[i];
      request.url = this.baseUrl ? this.baseUrl + request.path : request.path;
      delete request.path;
      this.requests[i] = rp.process(this.requests[i]);
      requests.push(this.requests[i]);
      promises.push(phin(this.requests[i]));
      if (count / this.fuzz.batchCount === 1) {
        responses = responses.concat(await Promise.all(promises));
        this.validate(requests, responses);
        promises = [];
        responses = [];
        requests = [];
        count = 0;
      }
    }
    responses = responses.concat(await Promise.all(promises));
    this.validate(requests, responses);
  }

  validate(requests, responses) {
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      const status = response.statusCode;
      if (status < 400 || status > 499) {
        log.warn('Request', requests[i]);
        log.warn('Response', helper.getTrimResponse(response));
        throw new Error(`Fuzz Failure | Status Code: ${status}`);
      }
    }
  }

}

module.exports = Tosser;