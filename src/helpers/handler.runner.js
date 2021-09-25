const handler = require('../exports/handler');

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

  state(name, data) {
    return handler.getStateHandler(name)({ data });
  },

  wait(name, ctx) {
    return handler.getWaitHandler(name)(ctx);
  },

  retry(name, ctx) {
    return handler.getRetryHandler(name)(ctx);
  }

};

module.exports = hr;