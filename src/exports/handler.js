const { PactumHandlerError } = require('../helpers/errors');

/**
 * @callback RequestResponseHandler
 * @param {object} req - request object
 * @param {object} res - response object
 */

/**
 * @typedef {object} Context
 * @property {any} [data] - custom data object passed to handler
 * @property {object} [spec] - spec will be available when used by `pactum.setState`
 */

/**
 * @callback StateHandler
 * @param {Context} ctx - context object
 */

const expectHandlers = {};
const retryHandlers = {};
const returnHandlers = {};
const stateHandlers =  {};

const handler = {

  /**
   * adds a custom expect handler
   * @param {string} name - name of the custom expect handler
   * @param {RequestResponseHandler} func - handler function
   * @example
   * pactum.handler.addExpectHandler('isUser', (req, res) => {
   *   assert.strictEqual(res.json.type, 'user');
   * });
   */
  addExpectHandler(name, func) {
    isValidHandler(name, func, 'expect');
    expectHandlers[name] = func;
  },

  getExpectHandler(name) {
    if (expectHandlers[name]) return expectHandlers[name];
    throw new PactumHandlerError(`Custom Expect Handler Not Found - ${name}`);
  },

  /**
   * adds a custom retry handler
   * @param {string} name - retry handler name
   * @param {RequestResponseHandler} func - retry handler function
   * @example
   * pactum.handler.addRetryHandler('RetryTill200', (req, res) => res.statusCode !== 200);
   */
  addRetryHandler(name, func) {
    isValidHandler(name, func, 'retry');
    retryHandlers[name] = func;
  },

  getRetryHandler(name) {
    if (retryHandlers[name]) return retryHandlers[name];
    throw new PactumHandlerError(`Custom Retry Handler Not Found - ${name}`);
  },

  /**
   * adds a custom return handler
   * @param {string} name - return handler name
   * @param {RequestResponseHandler} func - return handler function
   * @example
   * pactum.handler.addReturnHandler('ReturnOrderId', (req, res) => { return res.json.id });
   */
  addReturnHandler(name, func) {
    isValidHandler(name, func, 'return');
    returnHandlers[name] = func;
  },

  getReturnHandler(name) {
    return returnHandlers[name];
  },

  /**
   * adds a custom state handler
   * @param {string} name - state handler name
   * @param {StateHandler} func - state handler function
   * @example
   * pactum.handler.addStateHandler('there are no users', async (ctx) => { await db.clearUsers(); });
   * pactum.handler.addStateHandler('there is an order', async (ctx) => { await db.addOrder(ctx.data); });
   * pactum.handler.addStateHandler('there is a user', (ctx) => { ctx.spec.addInteraction({}); });
   */
  addStateHandler(name, func) {
    isValidHandler(name, func, 'state');
    stateHandlers[name] = func;
  },

  getStateHandler(name) {
    if (stateHandlers[name]) return stateHandlers[name];
    throw new PactumHandlerError(`Custom State Handler Not Found - ${name}`);
  }

}

function isValidHandler(name, func, type) {
  if (typeof name !== 'string' || name === '') {
    throw new PactumHandlerError(`Invalid custom ${type} handler name`);
  }
  if (typeof func !== 'function') {
    throw new PactumHandlerError(`Custom ${type} handler should be a function`);
  }
}

module.exports = handler;