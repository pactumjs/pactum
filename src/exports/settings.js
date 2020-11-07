const config = require('../config');
const logger = require('../helpers/logger');

const settings = {

  setLogLevel(level) {
    logger.setLevel(level);
  },

  setAssertHandlerStrategy(strategy) {
    config.strategy.assert.handler = strategy;
  },

  setAssertExpressionStrategy(strategy) {
    config.strategy.assert.expression = strategy;
  },

  setCaptureHandlerStrategy(strategy) {
    config.strategy.capture.handler = strategy;
  },

}

module.exports = settings;