const phin = require('phin');
const jqy = require('json-query');
const helper = require('../helpers/helper');
const config = require('../config');
const log = require('../helpers/logger');
const handler = require('../exports/handler');

class Tosser {

  constructor(spec) {
    this.spec = spec;
    this.request = spec._request;
    this.server = spec.server;
    this.state = spec._state;
    this.expect = spec._expect;
    this.returns = spec._returns;
    this.mockInteractions = spec.mockInteractions;
    this.pactInteractions = spec.pactInteractions;
    this.previousLogLevel = spec.previousLogLevel;
    this.response = {};
  }

  async toss() {
    this.updateRequest();
    await this.setState()
    this.addInteractionsToServer();
    await this.setResponse();
    this.setPreviousLogLevel();
    this.removeInteractionsFromServer();
    this.validateError();
    this.validateInteractions();
    this.validateResponse();
    return this.getOutput();
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

  setState() {
    return this.state.set(this.spec);
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
    this.response = await getResponse(this.request);
    const retryOptions = this.request.retryOptions;
    if (retryOptions) {
      const { count, delay, strategy } = retryOptions;
      let retry = false;
      for (let i = 0; i < count; i++) {
        if (typeof strategy === 'function') {
          retry = strategy(this.request, this.response);
        }
        if (typeof strategy === 'string') {
          const handlerFun = handler.getRetryHandler(strategy);
          retry = handlerFun(this.request, this.response);
        }
        if (retry) {
          await helper.sleep(delay);
          this.response = await getResponse(this.request);
        } else {
          break;
        }
      }
    }
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
    this.expect.validate(this.request, this.response);
  }

  getOutput() {
    const outputs = [];
    for (let i = 0; i < this.returns.length; i++) {
      const _handler = this.returns[i];
      if (typeof _handler === 'function') {
        outputs.push(_handler(this.request, this.response));
      }
      if (typeof _handler === 'string') {
        const _customHandlerFun = handler.getReturnHandler(_handler);
        if (_customHandlerFun) {
          outputs.push(_customHandlerFun(this.request, this.response));
        } else {
          outputs.push(jqy(_handler, { data: this.response.json }).value);
        }
      }
    }
    if (outputs.length === 1) {
      return outputs[0];
    } else if (outputs.length > 1) {
      return outputs;
    } else {
      return this.response;
    }
  }

}

function setBaseUrl(request) {
  if (config.request.baseUrl && !request.url.startsWith('http')) {
    request.url = config.request.baseUrl + request.url;
  }
}

function setHeaders(request) {
  if (Object.keys(config.request.headers).length > 0) {
    if (!request.headers) {
      request.headers = {};
    }
    for (const prop in config.request.headers) {
      if (prop in request.headers) {
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

async function getResponse(req) {
  let res = {};
  const requestStartTime = Date.now();
  try {
    res = await phin(req);
    res.json = helper.getJson(res.body);
  } catch (error) {
    log.warn('Error performing request', error);
    res = error;
  }
  res.responseTime = Date.now() - requestStartTime;
  printRequestResponse(req, res);
  return res;
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