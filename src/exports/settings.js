const config = require('../config');
const logger = require('../plugins/logger');
const jsonLike = require('../plugins/json.like');
const jsonMatch = require('../plugins/json.match');
const jsonSchema = require('../plugins/json.schema');
const fd = require('../plugins/form.data');

const settings = {

  setLogLevel(level) {
    logger.setLevel(level);
  },

  setLogger(lgr) {
    logger.setAdapter(lgr);
  },

  setJsonLikeAdapter(adapter) {
    jsonLike.setAdapter(adapter);
  },

  setJsonMatchAdapter(adapter) {
    jsonMatch.setAdapter(adapter);
  },

  setJsonSchemaAdapter(adapter) {
    jsonSchema.setAdapter(adapter);
  },

  setFormDataAdapter(adapter) {
    fd.setAdapter(adapter);
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
  },

  setRequestDefaultRetryCount(count) {
    config.request.retry.count = count;
  },

  setRequestDefaultRetryDelay(delay) {
    config.request.retry.delay = delay;
  }

};

module.exports = settings;