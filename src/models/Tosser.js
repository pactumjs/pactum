const phin = require('phin');
const fs = require('fs');
const helper = require('../helpers/helper');
const log = require('../plugins/logger');
const rlc = require('../helpers/reporter.lifeCycle');
const requestProcessor = require('../helpers/requestProcessor');
const th = require('../helpers/toss.helper');
const utils = require('../helpers/utils');
const mock = require('../exports/mock');
const request = require('../exports/request');
const config = require('../config');
const hr = require('../helpers/handler.runner');
const { events, pactumEvents, EVENT_TYPES } = require('../exports/events');

class Tosser {

  constructor(spec) {
    this.spec = spec;
    this.request = spec._request;
    this.state = spec._state;
    this.expect = spec._expect;
    this.sleep = spec._sleep;
    this.interactions = spec.interactions;
    this.previousLogLevel = spec.previousLogLevel;
    this.response = {};
    this.mockIds = [];
  }

  async toss() {
    try {
      this.spec.start = Date.now().toString();
      this.request = requestProcessor.process(this.request, this.spec._data_maps);
      await this.setState();
      await this.addInteractionsToServer();
      // get interactions to check for background property
      await this.getInteractionsFromServer();
      await this.setResponse();
      this.inspect();
      if (!hasBackgroundInteractions(this.interactions)) {
        await this.staticWait();
      }
      await this.getInteractionsFromServer();
      this.saveDataInFileSystem();
      this.recordData();
      this.storeSpecData();
      await this.validate();
      if (hasBackgroundInteractions(this.interactions) || (this.spec._wait && typeof this.spec._wait.arg1 === 'string')) {
        await this.dynamicWait();
        await this.getInteractionsFromServer();
        this.validateBackgroundInteractions();
      }
      return th.getOutput(this.spec, this.spec._returns);
    } finally {
      this.sleep > 0 && await helper.sleep(this.sleep);
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
      const status = options.status;
      for (let i = 0; i < count; i++) {
        let noRetry = true;
        const ctx = { req: this.request, res: this.response };
        if (typeof strategy === 'function') {
          noRetry = strategy(ctx);
        } else if (typeof strategy === 'string') {
          noRetry = hr.retry(strategy, ctx);
        } else if (status) {
          if (Array.isArray(status)) {
            noRetry = !(status.includes(this.response.statusCode));
          } else {
            noRetry = !(status === ctx.res.statusCode);
          }
        }
        else {
          try {
            await this.validateResponse();
          } catch (error) {
            noRetry = false;
          }
        }
        if (!noRetry) {
          const scale = delay === 1000 ? 'second' : 'seconds';
          log.info(`Request retry initiated, waiting ${delay / 1000} ${scale} for attempt ${i + 1} of ${count}`);
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
      if (typeof this.spec._inspect === 'boolean') {
        this.printRequestAndResponse();
      } else {
        for (let i = 0; i < this.spec._inspect.length; i++) {
          const inspect_path = this.spec._inspect[i];
          log.warn(inspect_path, th.getPathValueFromRequestResponse(inspect_path, this.spec._request, this.spec._response));
        }
      }
    }
  }

  async staticWait() {
    const _wait = this.spec._wait;
    if (_wait && _wait.arg1) {
      if (typeof _wait.arg1 === 'number') {
        await helper.sleep(_wait.arg1);
      } else {
        await _wait.arg1;
      }
    }
  }

  async dynamicWait() {
    const _wait = this.spec._wait;
    if (_wait) {
      if (typeof _wait.arg1 === 'undefined' || typeof _wait.arg1 === 'number') {
        let duration = config.response.wait.duration;
        let polling = config.response.wait.polling;
        let waited = 0;
        if (typeof _wait.arg1 === 'number') {
          duration = _wait.arg1;
          polling = _wait.arg2 && _wait.arg2 > 0 ? _wait.arg2 : 100;
        }
        while (waited < duration) {
          waited = waited + polling;
          await this.getInteractionsFromServer();
          try {
            this.validateBackgroundInteractions();
            break;
          } catch (error) {
            if (waited > duration) throw error;
          }
          await helper.sleep(polling);
        }
      } else {
        await hr.wait(_wait.arg1, { req: this.request, res: this.response, data: _wait.arg2, rootData: this.spec._specHandlerData });
      }
    }
  }

  setPreviousLogLevel() {
    if (this.previousLogLevel) {
      log.setLevel(this.previousLogLevel);
    }
  }

  saveDataInFileSystem() {
    if (this.spec._save && this.response.buffer) {
      fs.writeFileSync(this.spec._save, this.response.buffer);
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
      this.validateNonBackgroundInteractions();
      await this.validateResponse();
      this.spec.status = 'PASSED';
      this.storeSpecData();
      this.runReport();
    } catch (error) {
      this.spec.status = 'FAILED';
      this.storeSpecData();
      this.spec.failure = error.toString();
      this.runReport();
      this.printRequestAndResponse();
      throw error;
    }
  }

  validateError() {
    if (this.response instanceof Error && this.expect.errors.length === 0) {
      this.spec.status = 'ERROR';
      this.spec.failure = this.response.toString();
      this.runReport();
      this.printRequestAndResponse();
      this.expect.fail(this.response);
    }
  }

  validateNonBackgroundInteractions() {
    const nonBgInteractions = this.interactions.filter(interaction => !interaction.background);
    this.expect.validateInteractions(nonBgInteractions);
  }

  validateBackgroundInteractions() {
    const bgInteractions = this.interactions.filter(interaction => interaction.background);
    this.expect.validateInteractions(bgInteractions);
  }

  async validateResponse() {
    await this.expect.validate(this.request, this.response);
  }

  runReport() {
    if (config.reporter.autoRun && this.expect.errors.length === 0) {
      rlc.afterSpecReport(this.spec);
    }
  }

  printRequestAndResponse() {
    if (this.spec._inspect !== false) {
      utils.printReqAndRes(this.request, this.response);
    }
  }

  storeSpecData() {
    const stores = [];
    switch (this.spec.status) {
      case 'PASSED':
        for (const store of this.spec._stores) {
          if (store && store.options && store.options.status === 'PASSED') {
            stores.push(store);
          }
        }
        break;
      case 'FAILED':
        for (const store of this.spec._stores) {
          if (store && store.options && store.options.status === 'FAILED') {
            stores.push(store);
          }
        }
        break;
      default:
        for (const store of this.spec._stores) {
          if (store && (!store.options || !store.options.status)) {
            stores.push(store);
          }
        }
        break;
    }
    if (stores.length > 0) {
      th.storeSpecData(this.spec, stores);
    }
  }

}

async function getResponse(tosser) {
  const { request, expect } = tosser;
  let res = {};
  const requestStartTime = Date.now();
  try {
    events.emit(EVENT_TYPES.BEFORE_REQUEST, request);
    pactumEvents.emit(EVENT_TYPES.BEFORE_REQUEST, { request });
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
  } finally {
    res.responseTime = Date.now() - requestStartTime;
    events.emit(EVENT_TYPES.AFTER_RESPONSE, res);
    pactumEvents.emit(EVENT_TYPES.AFTER_RESPONSE, { request, response: res });
  }
  return res;
}

function hasBackgroundInteractions(interactions) {
  return interactions.some(interaction => interaction.background);
}

module.exports = Tosser;