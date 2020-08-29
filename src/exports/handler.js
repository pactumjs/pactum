const expectHandlers = {};
const retryHandlers = {};
const returnHandlers = {};
const stateHandlers =  {};

const handler = {

  /**
   * adds a custom expect handler
   * @param {string} name - name of the custom expect handler
   * @param {function} func - handler function
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
    return expectHandlers[name];
  },

  /**
   * adds a custom retry handler
   * @param {string} name - retry handler name
   * @param {function} func - retry handler function
   * @example
   * pactum.handler.addRetryHandler('RetryTill200', (req, res) => res.statusCode !== 200);
   */
  addRetryHandler(name, func) {
    isValidHandler(name, func, 'retry');
    retryHandlers[name] = func;
  },

  getRetryHandler(name) {
    return retryHandlers[name];
  },

  /**
   * adds a custom return handler
   * @param {string} name - return handler name
   * @param {function} func - return handler function
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
   * @param {function} func - state handler function
   * @example
   * pactum.handler.addStateHandler('there are no users', async () => { await db.clearUsers(); });
   */
  addStateHandler(name, func) {
    isValidHandler(name, func, 'state');
    stateHandlers[name] = func;
  },

  getStateHandler(name) {
    return stateHandlers[name];
  }

}

function isValidHandler(name, func, type) {
  if (typeof name !== 'string' || name === '') {
    throw new Error(`Invalid custom ${type} handler name`);
  }
  if (typeof func !== 'function') {
    throw new Error(`Custom ${type} handler should be a function`);
  }
}

module.exports = handler;