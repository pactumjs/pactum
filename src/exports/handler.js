const customExpectHandler = {};

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
  }

}

module.exports = handler;