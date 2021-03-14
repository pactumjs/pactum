const handler = require('../exports/handler');
const log = require('./logger');

const hr = {

  interaction(name, data) {
    const mi = handler.getInteractionHandler(name)({ data });
    if (mi && mi.name) return this.interaction(mi.name, mi.data);
    return mi;
  },

  capture(name, ctx) {
    return handler.getCaptureHandler(name)(ctx);
  },

  spec(name, data, spec) {
    if (typeof name !== 'undefined') {
      handler.getSpecHandler(name)({ spec, data });
    }
  },

  async initialize() {
    const handlers = handler.getInitializeHandlers();
    const keys = Object.keys(handlers);
    for (let i = 0; i < keys.length; i++) {
      log.info(`Running Initializer - ${keys[i]}`);
      await handlers[keys[i]]();
    }
  },

  async cleanup() {
    const handlers = handler.getCleanupHandlers();
    const keys = Object.keys(handlers);
    for (let i = 0; i < keys.length; i++) {
      log.info(`Running Cleaner - ${keys[i]}`);
      await handlers[keys[i]]();
    }
  }

};

module.exports = hr;