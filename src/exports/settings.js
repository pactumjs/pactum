const config = require('../config');
const logger = require('./logger');

const settings = {

  setLogLevel(level) {
    logger.get().setLevel(level);
  },

  setLogger(lgr) {
    logger.set(lgr);
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

  setSnapshotDirectoryPath(path) {
    config.snapshot.dir = path;
  },

  setReporterAutoRun(val) {
    config.reporter.autoRun = val;
  }

};

module.exports = settings;