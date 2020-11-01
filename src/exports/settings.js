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

  setReturnHandlerStrategy(strategy) {
    config.strategy.return.handler = strategy;
  },

}

module.exports = settings;