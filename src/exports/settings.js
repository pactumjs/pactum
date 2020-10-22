const config = require('../config');
const logger = require('../helpers/logger');

const settings = {

  setLogLevel(level) {
    logger.setLevel(level);
  },

  setAssertHandlerStartsWith(value) {
    config.assert.handler.startsWith = value;
  },

  setAssertExpressionIncludes(value) {
    config.assert.expression.includes = value;
  }

}

module.exports = settings;