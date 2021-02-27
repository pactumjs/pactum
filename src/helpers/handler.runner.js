const handler = require('../exports/handler');

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
  }

};

module.exports = hr;