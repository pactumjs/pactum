const phin = require('phin');
const helper = require('../helpers/helper');
const config = require('../config');
const log = require('../helpers/logger');

class Tosser {

  constructor(params) {
    this.request = params.request;
    this.server = params.server;
    this.mockInteractions = params.mockInteractions;
    this.pactInteractions = params.pactInteractions;
    this.expect = params.expect;
    this.previousLogLevel = this.previousLogLevel;
    this.response = {};
  }

  updateRequest() {
    const query = helper.getPlainQuery(this.request.qs);
    if (query) {
      this.request.url = this.request.url + '?' + query;
    }
    setBaseUrl(this.request);
    this.request.timeout = this.request.timeout || config.request.timeout;
    setHeaders(this.request);
    setMultiPartFormData(this.request);
  }

  addInteractionsToServer() {
    for (const [id, interaction] of this.mockInteractions) {
      this.server.addMockInteraction(id, interaction);
    }
    for (const [id, interaction] of this.pactInteractions) {
      this.server.addPactInteraction(id, interaction);
    }
  }

  async setResponse() {
    const requestStartTime = Date.now();
    try {
      this.response = await phin(this.request);
      this.response.json = helper.getJson(this.response.body);
    } catch (error) {
      log.warn('Error performing request', error);
      this.response = error;
    }
    this.response.responseTime = Date.now() - requestStartTime;
    printRequestResponse(this.request, this.response);
  }

  setPreviousLogLevel() {
    if (this.previousLogLevel) {
      log.setLevel(this.previousLogLevel);
    }
  }

  removeInteractionsFromServer() {
    for (const [id, interaction] of this.mockInteractions) {
      this.server.removeInteraction(id);
    }
    for (const [id, interaction] of this.pactInteractions) {
      this.server.removeInteraction(id);
    }
  }

  validateError() {
    if (this.response instanceof Error) {
      this.expect.fail(this.response);
    }
  }

  validateInteractions() {
    this.expect.validateInteractions(this.mockInteractions);
    this.expect.validateInteractions(this.pactInteractions);
  }

  validateResponse() {
    this.expect.validate(this.response);
  }

}


function setBaseUrl(request) {
  if (config.request.baseUrl) {
    request.url = config.request.baseUrl + request.url;
  }
}

function setHeaders(request) {
  if (config.request.headers && Object.keys(config.request.headers).length > 0) {
    if (!request.headers) {
      request.headers = {};
    }
    for (const prop in config.request.headers) {
      if (request.headers[prop]) {
        continue;
      } else {
        request.headers[prop] = config.request.headers[prop];
      }
    }
  }
}

function setMultiPartFormData(request) {
  if (request._multiPartFormData) {
    request.data = request._multiPartFormData.getBuffer();
    const multiPartHeaders = request._multiPartFormData.getHeaders();
    if (!request.headers) {
      request.headers = multiPartHeaders;
    } else {
      for (const prop in multiPartHeaders) {
        request.headers[prop] = multiPartHeaders[prop];
      }
    }
    delete request._multiPartFormData;
  }
}

function printRequestResponse(req, res) {
  if (log.levelValue <= 4) {
    const rr = {
      request: req,
      response: {
        statusCode: res.statusCode,
        headers: res.headers,
        json: res.json
      }
    }
    log.debug('Request & Response =>', JSON.stringify(rr, null, 2));
  }
}

module.exports = Tosser;