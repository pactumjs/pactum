const config = require('../config');
const logger = require('../helpers/logger');

const settings = {

  setLogLevel(level) {
    logger.setLevel(level);
  },

  setAssertHandlerStrategy(strategy) {
    config.assert.handler = strategy;
  },

  setAssertExpressionStrategy(strategy) {
    config.assert.expression = strategy;
  }

}

module.exports = settings;