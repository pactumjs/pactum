const handler = require('../exports/handler');

const hr = {

  mockInteraction(name, data) {
    const mi = handler.getMockInteractionHandler(name)({ data });
    if (mi && mi.name) return this.mockInteraction(mi.name, mi.data);
    return mi;
  },

  pactInteraction(name, data) {
    const pi = handler.getPactInteractionHandler(name)({ data });
    if (pi && pi.name) return this.pactInteraction(pi.name, pi.data);
    return pi;
  }

};

module.exports = hr;