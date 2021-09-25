const { PactumHandlerError } = require('../helpers/errors');
const config = require('../config');

const specHandlers = {};
const expectHandlers = {};
const retryHandlers = {};
const captureHandlers = {};
const stateHandlers =  {};
const dataHandlers = {};
const interactionHandlers = {};
const assertHandlers = {};
const waitHandlers = {};

const handler = {

  addSpecHandler(name, func) {
    isValidHandler(name, func);
    specHandlers[name] = func;
  },

  getSpecHandler(name) {
    if (specHandlers[name]) return specHandlers[name];
    throw new PactumHandlerError(`Spec Handler Not Found - '${name}'`);
  },

  addExpectHandler(name, func) {
    isValidHandler(name, func);
    expectHandlers[name] = func;
  },

  getExpectHandler(name) {
    if (expectHandlers[name]) return expectHandlers[name];
    throw new PactumHandlerError(`Expect Handler Not Found - '${name}'`);
  },

  addRetryHandler(name, func) {
    isValidHandler(name, func);
    retryHandlers[name] = func;
  },

  getRetryHandler(name) {
    if (retryHandlers[name]) return retryHandlers[name];
    throw new PactumHandlerError(`Retry Handler Not Found - '${name}'`);
  },

  addCaptureHandler(name, func) {
    isValidHandler(name, func);
    captureHandlers[name] = func;
  },

  getCaptureHandler(name) {
    if (captureHandlers[name]) return captureHandlers[name];
    throw new PactumHandlerError(`Capture Handler Not Found - '${name}'`);
  },

  addStateHandler(name, func) {
    isValidHandler(name, func);
    stateHandlers[name] = func;
  },

  getStateHandler(name) {
    if (stateHandlers[name]) return stateHandlers[name];
    throw new PactumHandlerError(`State Handler Not Found - '${name}'`);
  },

  addDataFuncHandler(name, func) {
    isValidHandler(name, func);
    dataHandlers[name] = func;
    config.data.ref.fun.enabled = true;
  },

  getDataFuncHandler(name) {
    if (dataHandlers[name]) return dataHandlers[name];
    throw new PactumHandlerError(`Data Handler Not Found - '${name}'`);
  },

  addInteractionHandler(name, func) {
    isValidHandler(name, func);
    interactionHandlers[name] = func;
  },

  getInteractionHandler(name) {
    if (interactionHandlers[name]) return interactionHandlers[name];
    throw new PactumHandlerError(`Interaction Handler Not Found - '${name}'`);
  },

  addAssertHandler(name, func) {
    isValidHandler(name, func);
    assertHandlers[name] = func;
  },

  getAssertHandler(name) {
    if (assertHandlers[name]) return assertHandlers[name];
    throw new PactumHandlerError(`Assert Handler Not Found - '${name}'`);
  },

  addWaitHandler(name, func) {
    isValidHandler(name, func);
    waitHandlers[name] = func;
  },

  getWaitHandler(name) {
    if (waitHandlers[name]) return waitHandlers[name];
    throw new PactumHandlerError(`Wait Handler Not Found - '${name}'`);
  }

};

function isValidHandler(name, func) {
  if (typeof name !== 'string' || name === '') {
    throw new PactumHandlerError('`name` is required');
  }
  if (typeof func !== 'function') {
    throw new PactumHandlerError('`func` is required');
  }
}

module.exports = handler;