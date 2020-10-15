const { PactumHandlerError } = require('../helpers/errors');
const config = require('../config');

const specHandlers = {};
const expectHandlers = {};
const retryHandlers = {};
const returnHandlers = {};
const stateHandlers =  {};
const dataHandlers = {};
const mockInteractionHandlers = {};
const pactInteractionHandlers = {};

const handler = {

  addSpecHandler(name, func) {
    isValidHandler(name, func);
    specHandlers[name] = func;
  },

  getSpecHandler(name) {
    if (specHandlers[name]) return specHandlers[name];
    throw new PactumHandlerError(`Custom Spec Handler Not Found - ${name}`);
  },

  addExpectHandler(name, func) {
    isValidHandler(name, func);
    expectHandlers[name] = func;
  },

  getExpectHandler(name) {
    if (expectHandlers[name]) return expectHandlers[name];
    throw new PactumHandlerError(`Custom Expect Handler Not Found - ${name}`);
  },

  addRetryHandler(name, func) {
    isValidHandler(name, func);
    retryHandlers[name] = func;
  },

  getRetryHandler(name) {
    if (retryHandlers[name]) return retryHandlers[name];
    throw new PactumHandlerError(`Custom Retry Handler Not Found - ${name}`);
  },

  addReturnHandler(name, func) {
    isValidHandler(name, func);
    returnHandlers[name] = func;
  },

  getReturnHandler(name) {
    return returnHandlers[name];
  },

  addStateHandler(name, func) {
    isValidHandler(name, func);
    stateHandlers[name] = func;
  },

  getStateHandler(name) {
    if (stateHandlers[name]) return stateHandlers[name];
    throw new PactumHandlerError(`Custom State Handler Not Found - ${name}`);
  },

  addDataFunHandler(name, func) {
    isValidHandler(name, func);
    dataHandlers[name] = func;
    config.data.ref.fun.enabled = true;
  },

  getDataFunHandler(name) {
    if (dataHandlers[name]) return dataHandlers[name];
    throw new PactumHandlerError(`Custom Data Handler Not Found - ${name}`);
  },

  addMockInteractionHandler(name, func) {
    isValidHandler(name, func);
    mockInteractionHandlers[name] = func;
  },

  getMockInteractionHandler(name) {
    if (mockInteractionHandlers[name]) return mockInteractionHandlers[name];
    throw new PactumHandlerError(`Custom Mock Interaction Handler Not Found - ${name}`);
  },

  addPactInteractionHandler(name, func) {
    isValidHandler(name, func);
    pactInteractionHandlers[name] = func;
  },

  getPactInteractionHandler(name) {
    if (pactInteractionHandlers[name]) return pactInteractionHandlers[name];
    throw new PactumHandlerError(`Custom Pact Interaction Handler Not Found - ${name}`);
  }

}

function isValidHandler(name, func) {
  if (typeof name !== 'string' || name === '') {
    throw new PactumHandlerError('`name` is required');
  }
  if (typeof func !== 'function') {
    throw new PactumHandlerError('`func` is required');
  }
}

module.exports = handler;