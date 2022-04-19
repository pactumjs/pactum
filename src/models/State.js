const handler = require('../exports/handler');
const { PactumHandlerError } = require('../helpers/errors');

class State {

  constructor() {
    this.handlers = [];
  }

  add(name, data) {
    if (typeof name !== 'string' || name === '') {
      throw new PactumHandlerError(`Invalid custom state handler name provided`);
    }
    this.handlers.push({ name, data });
  }

  async set(spec) {
    for (let i = 0; i < this.handlers.length; i++) {
      const currentHandler = this.handlers[i];
      const handlerFun = handler.getStateHandler(currentHandler.name);
      const ctx = { spec, data: currentHandler.data };
      await handlerFun(ctx);
    }
  }
}

module.exports = State;
