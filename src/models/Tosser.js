const phin = require('phin');
const helper = require('../helpers/helper');
const log = require('../plugins/logger');
const rlc = require('../helpers/reporter.lifeCycle');
const requestProcessor = require('../helpers/requestProcessor');
const th = require('../helpers/toss.helper');
const utils = require('../helpers/utils');
const mock = require('../exports/mock');
const handler = require('../exports/handler');
const request = require('../exports/request');
const config = require('../config');

class Tosser {

  constructor(spec) {
    this.spec = spec;
    this.request = spec._request;
    this.state = spec._state;
    this.expect = spec._expect;
    this.interactions = spec.interactions;
    this.previousLogLevel = spec.previousLogLevel;
    this.response = {};
    this.mockIds = [];
  }

  async toss() {
    try {
      this.spec.start = Date.now().toString();
      this.request = requestProcessor.process(this.request);
      await this.setState();
      await this.addInteractionsToServer();
      await this.setResponse();
      this.inspect();
      await this.wait();
      await this.getInteractionsFromServer();
      this.recordData();
      th.storeSpecData(this.spec, this.spec._stores);
      await this.validate();
      return th.getOutput(this.spec, this.spec._returns);
    } finally {
      await this.removeInteractionsFromServer();
      this.setPreviousLogLevel();
    }
  }

  setState() {
    return this.state.set(this.spec);
  }

  async addInteractionsToServer() {
    let mockIdPromises = [];
    for (let i = 0; i < this.interactions.length; i++) {
      const { interaction, data } = this.interactions[i];
      const ids = mock.addInteraction(interaction, data);
      if (Array.isArray(ids)) {
        mockIdPromises = mockIdPromises.concat(ids);
      } else {
        mockIdPromises.push(ids);
      }
    }
    this.mockIds = this.mockIds.concat(await Promise.all(mockIdPromises));
  }

  async setResponse() {
    this.response = await getResponse(this);
    const options = this.request.retryOptions;
    if (options) {
      const count = typeof options.count === 'number' ? options.count : config.request.retry.count;
      const delay = typeof options.delay === 'number' ? options.delay : config.request.retry.delay;
      const strategy = options.strategy;
      for (let i = 0; i < count; i++) {
        let noRetry = true;
        const ctx = { req: this.request, res: this.response };
        if (typeof strategy === 'function') {
          noRetry = strategy(ctx);
        } else if (typeof strategy === 'string') {
          const handlerFun = handler.getRetryHandler(strategy);
          noRetry = handlerFun(ctx);
        } else {
          try {
            await this.validateResponse();
          } catch (error) {
            noRetry = false;
          }
        }
        if (!noRetry) {
          const scale = delay === 1000 ? 'second' : 'seconds';
          log.debug(`Retrying request in ${delay / 1000} ${scale}`);
          await helper.sleep(delay);
          this.response = await getResponse(this);
        } else {
          break;
        }
      }
    }
    delete this.spec._request.data;
    this.spec._response = this.response;
  }

  inspect() {
    if (this.spec._inspect) {
      log.warn('Inspecting Request & Response');
      utils.printReqAndRes(this.request, this.response);
    }
  }

  async wait() {
    const _wait = this.spec._wait;
    if (typeof _wait === 'number') {
      await helper.sleep(_wait);
    } else if (_wait && typeof _wait === 'object') {
      await _wait;
    }
  }

  setPreviousLogLevel() {
    if (this.previousLogLevel) {
      log.setLevel(this.previousLogLevel);
    }
  }

  recordData() {
    const defaultRecorders = request.getDefaultRecorders();
    th.recordSpecData(this.spec, defaultRecorders);
    th.recordSpecData(this.spec, this.spec._recorders);
  }

  async getInteractionsFromServer() {
    if (this.mockIds.length > 0) {
      this.interactions.length = 0;
      this.interactions = this.interactions.concat(await mock.getInteraction(this.mockIds));
      this.spec.interactions = this.interactions;
    }
  }

  async removeInteractionsFromServer() {
    if (this.mockIds.length > 0) {
      await mock.removeInteraction(this.mockIds);
    }
  }

  async validate() {
    this.validateError();
    try {
      this.validateInteractions();
      await this.validateResponse();
      this.spec.status = 'PASSED';
      this.runReport();
    } catch (error) {
      this.spec.status = 'FAILED';
      this.spec.failure = error.toString();
      this.runReport();
      utils.printReqAndRes(this.request, this.response);
      throw error;
    }
  }

  validateError() {
    if (this.response instanceof Error && this.expect.errors.length === 0) {
      this.spec.status = 'ERROR';
      this.spec.failure = this.response.toString();
      this.runReport();
      utils.printReqAndRes(this.request, this.response);
      this.expect.fail(this.response);
    }
  }

  validateInteractions() {
    this.expect.validateInteractions(this.interactions);
  }

  async validateResponse() {
    await this.expect.validate(this.request, this.response);
  }

  runReport() {
    if (config.reporter.autoRun && this.expect.errors.length === 0) {
      rlc.afterSpecReport(this.spec);
    }
  }

}

async function getResponse(tosser) {
  const { request, expect } = tosser;
  let res = {};
  const requestStartTime = Date.now();
  try {
    log.debug(`${request.method} ${request.url}`);
    res = await phin(request);
    res.buffer = res.body;
    res.text = helper.bufferToString(res.body) || '';
    res.body = helper.bufferToString(res.body);
    res.json = helper.getJson(res.body);
    if (helper.isContentJson(res)) {
      res.body = res.json;
    }
  } catch (error) {
    if (expect.errors.length === 0) {
      log.error('Error performing request', error);
    }
    res = error;
  }
  res.responseTime = Date.now() - requestStartTime;
  return res;
}

module.exports = Tosser;