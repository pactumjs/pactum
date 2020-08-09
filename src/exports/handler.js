const customExpectHandler = {};
const retryHandler = {};

const handler = {

  /**
   * adds custom expect handler
   * @param {string} name - name of the custom expect handler
   * @param {function} func - handler function
   * @example
   * pactum.handler.addCustomExpectHandler('isUser', (response) => {
   *   assert.strictEqual(response.json.type, 'user');
   * });
   */
  addCustomExpectHandler(name, func) {
    if (typeof name !== 'string' || name === '') {
      throw new Error('Invalid custom expect handler name');
    }
    if (typeof func !== 'function') {
      throw new Error('Custom expect handler should be a function');
    }
    customExpectHandler[name] = func;
  },

  getExpectHandler(name) {
    return customExpectHandler[name];
  },

  /**
   * adds retry handler
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
  }

}

module.exports = handler;