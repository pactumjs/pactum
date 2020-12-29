const phin = require('phin');
const jqy = require('json-query');
const config = require('../config');
const hr = require('../helpers/handler.runner');
const helper = require('../helpers/helper');
const log = require('../helpers/logger');
const rlc = require('../helpers/reporter.lifeCycle');
const requestProcessor = require('../helpers/requestProcessor');
const mock = require('../exports/mock');
const handler = require('../exports/handler');
const stash = require('../exports/stash');
const request = require('../exports/request');

class Tosser {

  constructor(spec) {
    this.spec = spec;
    this.request = spec._request;
    this.state = spec._state;
    this.expect = spec._expect;
    this.stores = spec._stores;
    this.returns = spec._returns;
    this.recorders = spec._recorders;
    this.interactions = spec.interactions;
    this.previousLogLevel = spec.previousLogLevel;
    this.response = {};
    this.mockIds = [];
  }

  async toss() {
    this.spec.start = Date.now().toString();
    this.request = requestProcessor.process(this.request);
    await this.setState();
    await this.addInteractionsToServer();
    await this.setResponse();
    this.inspect();
    await this.sleep(this.spec._waitDuration);
    this.setPreviousLogLevel();
    await this.getInteractionsFromServer();
    await this.removeInteractionsFromServer();
    this.recordData();
    this.storeSpecData();
    this.validate();
    return this.getOutput();
  }

  setState() {
    return this.state.set(this.spec);
  }

  async addInteractionsToServer() {
    const mockIdPromises = [];
    for (let i = 0; i < this.interactions.length; i++) {
      const raw = this.interactions[i];
      mockIdPromises.push(mock.addInteraction(raw.interaction, raw.data));
    }
    this.mockIds = this.mockIds.concat(await Promise.all(mockIdPromises));
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
          const ctx = { req: this.request, res: this.response };
          retry = handlerFun(ctx);
        }
        if (retry) {
          await helper.sleep(delay);
          this.response = await getResponse(this.request);
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
      this.printReqAndRes();
    }
  }

  setPreviousLogLevel() {
    if (this.previousLogLevel) {
      log.setLevel(this.previousLogLevel);
    }
  }

  recordData() {
    const defaultRecorders = request.getDefaultRecorders();
    defaultRecorders.forEach(recorder => { recordData(recorder, this.spec); });
    this.recorders.forEach(recorder => { recordData(recorder, this.spec); });
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

  validate() {
    this.validateError();
    try {
      this.validateInteractions();
      this.validateResponse();
      this.spec.status = 'PASSED';
      rlc.afterSpecReport(this.spec);
    } catch (error) {
      this.spec.status = 'FAILED';
      this.spec.failure = error.toString();
      rlc.afterSpecReport(this.spec);
      this.printReqAndRes();
      throw error;
    }
  }

  validateError() {
    if (this.response instanceof Error) {
      this.spec.status = 'ERROR';
      this.spec.failure = this.response.toString();
      rlc.afterSpecReport(this.spec);
      this.expect.fail(this.response);
    }
  }

  validateInteractions() {
    this.expect.validateInteractions(this.interactions);
  }

  validateResponse() {
    this.expect.validate(this.request, this.response);
  }

  printReqAndRes() {
    log.warn('Request', this.request);
    log.warn('Response', helper.getTrimResponse(this.response));
  }

  storeSpecData() {
    const ctx = { req: this.request, res: this.response };
    for (let i = 0; i < this.stores.length; i++) {
      const store = this.stores[i];
      const specData = {};
      const captureHandler = getCaptureHandlerName(store.path);
      if (captureHandler) {
        specData[store.name] = hr.capture(captureHandler, ctx);
      } else {
        specData[store.name] = getPathValueFromSpec(store.path, this.spec);
      }
      stash.addDataStore(specData);
    }
  }

  sleep(ms) {
    if (typeof ms === 'number') {
      return helper.sleep(ms);
    }
  }

  getOutput() {
    const outputs = [];
    const ctx = { req: this.request, res: this.response };
    for (let i = 0; i < this.returns.length; i++) {
      const _return = this.returns[i];
      if (typeof _return === 'function') {
        outputs.push(_return(ctx));
      }
      if (typeof _return === 'string') {
        const captureHandler = getCaptureHandlerName(_return);
        if (captureHandler) {
          outputs.push(hr.capture(captureHandler, ctx));
        } else {
          outputs.push(getPathValueFromSpec(_return, this.spec));
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

async function getResponse(req) {
  let res = {};
  const requestStartTime = Date.now();
  try {
    log.debug(`${req.method} ${req.url}`);
    res = await phin(req);
    res.json = helper.getJson(res.body);
  } catch (error) {
    log.warn('Error performing request', error);
    res = error;
  }
  res.responseTime = Date.now() - requestStartTime;
  return res;
}

function recordData(recorder, spec) {
  try {
    const { name, path } = recorder;
    const captureHandler = getCaptureHandlerName(path);
    if (captureHandler) {
      spec.recorded[name] = hr.capture(captureHandler, { req: spec._request, res: spec._response });
    } else {
      spec.recorded[name] = getPathValueFromSpec(path, spec);
    }
  } catch (error) {
    log.warn('Unable to record data');
    log.warn(error.toString());
  }
}

function getPathValueFromSpec(path, spec) {
  let data;
  if (path.startsWith('req.headers')) {
    path = path.replace('req.headers', '');
    data = spec._request.headers;
  } else if (path.startsWith('req.body')) {
    path = path.replace('req.body', '');
    data = spec._request.body;
  } else if (path.startsWith('res.headers')) {
    path = path.replace('res.headers', '');
    data = spec._response.headers;
  } else {
    path = path.replace('res.body', '');
    data = spec._response.json;
  }
  return jqy(path, { data }).value;
}

function getCaptureHandlerName(name) {
  if (helper.matchesStrategy(name, config.strategy.capture.handler)) {
    return helper.sliceStrategy(name, config.strategy.capture.handler);
  }
}

module.exports = Tosser;