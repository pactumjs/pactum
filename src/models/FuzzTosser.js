const phin = require('phin');
const core = require('openapi-fuzzer-core');
const log = require('../helpers/logger');

class Tosser {

  constructor(fuzz) {
    this.fuzz = fuzz;
    this.requests = [];
    this.responses = [];
  }

  async toss() {
    const data = await this.getSwaggerJson();
    this.requests = core.swagger(data);
    await this.validateResponses();
  }

  async getSwaggerJson() {
    const response = await phin({ method: 'get', url: this.swaggerUrl, parse: 'json' });
    return response.body;
  }

  async validateResponses() {
    let requests = [];
    let promises = [];
    let responses = [];
    let count = 0;
    for (let i = 0; i < this.requests.length; i++) {
      count = count + 1;
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
    this.validate(responses);
  }

  validate(requests, responses) {
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      const status = response.statusCode;
      if (status < 400 || status > 499) {
        log.warn('Request', requests[i]);
        log.warn('Response', response);
        throw new Error(`Fuzz Failure | Status Code: ${status}`);
      }
    }
  }

}

module.exports = Tosser;