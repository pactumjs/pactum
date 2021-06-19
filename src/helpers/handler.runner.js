const handler = require('../exports/handler');
const log = require('../plugins/logger');

const hr = {

  interaction(name, data) {
    const mi = handler.getInteractionHandler(name)({ data });
    if (Array.isArray(mi)) {
      const interactions = [];
      for (let i = 0; i < mi.length; i++) {
        if (mi[i] && mi[i].name) {
          interactions.push(this.interaction(mi[i].name, mi[i].data));
        } else {
          interactions.push(mi[i]);
        }
      }
      return interactions;
    } else {
      if (mi && mi.name) return this.interaction(mi.name, mi.data);
      return mi;
    }
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
  },

  state(name, data) {
    return handler.getStateHandler(name)({ data });
  }

};

module.exports = hr;