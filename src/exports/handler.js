const { PactumHandlerError } = require('../helpers/errors');

const expectHandlers = {};
const retryHandlers = {};
const returnHandlers = {};
const stateHandlers =  {};

const handler = {

  addExpectHandler(name, func) {
    isValidHandler(name, func, 'expect');
    expectHandlers[name] = func;
  },

  getExpectHandler(name) {
    if (expectHandlers[name]) return expectHandlers[name];
    throw new PactumHandlerError(`Custom Expect Handler Not Found - ${name}`);
  },

  addRetryHandler(name, func) {
    isValidHandler(name, func, 'retry');
    retryHandlers[name] = func;
  },

  getRetryHandler(name) {
    if (retryHandlers[name]) return retryHandlers[name];
    throw new PactumHandlerError(`Custom Retry Handler Not Found - ${name}`);
  },

  addReturnHandler(name, func) {
    isValidHandler(name, func, 'return');
    returnHandlers[name] = func;
  },

  getReturnHandler(name) {
    return returnHandlers[name];
  },

  addStateHandler(name, func) {
    isValidHandler(name, func, 'state');
    stateHandlers[name] = func;
  },

  getStateHandler(name) {
    if (stateHandlers[name]) return stateHandlers[name];
    throw new PactumHandlerError(`Custom State Handler Not Found - ${name}`);
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