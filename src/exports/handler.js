const expectHandler = {};
const retryHandler = {};
const returnHandler = {};

const handler = {

  /**
   * adds custom expect handler
   * @param {string} name - name of the custom expect handler
   * @param {function} func - handler function
   * @example
   * pactum.handler.addExpectHandler('isUser', (response) => {
   *   assert.strictEqual(response.json.type, 'user');
   * });
   */
  addExpectHandler(name, func) {
    if (typeof name !== 'string' || name === '') {
      throw new Error('Invalid custom expect handler name');
    }
    if (typeof func !== 'function') {
      throw new Error('Custom expect handler should be a function');
    }
    expectHandler[name] = func;
  },

  getExpectHandler(name) {
    return expectHandler[name];
  },

  /**
   * adds custom retry handler
   * @param {string} name - retry handler name
   * @param {function} func - retry handler function
   * @example
   * pactum.handler.addRetryHandler('RetryTill200', (res) => res.statusCode !== 200);
   */
  addRetryHandler(name, func) {
    if (typeof name !== 'string' || name === '') {
      throw new Error('Invalid retry handler name');
    }
    if (typeof func !== 'function') {
      throw new Error('Retry handler should be a function');
    }
    retryHandler[name] = func;
  },

  getRetryHandler(name) {
    return retryHandler[name];
  },

  /**
   * adds custom return handler
   * @param {string} name - return handler name
   * @param {function} func - return handler function
   * @example
   * pactum.handler.addReturnHandler('ReturnOrderId', (req, res) => { return res.json.id });
   */
  addReturnHandler(name, func) {
    if (typeof name !== 'string' || name === '') {
      throw new Error('Invalid return handler name');
    }
    if (typeof func !== 'function') {
      throw new Error('Return handler should be a function');
    }
    returnHandler[name] = func;
  },

  getReturnHandler(name) {
    return returnHandler[name];
  },

}

module.exports = handler;