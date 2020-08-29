const handler = require('../exports/handler');

class State {

  constructor() {
    this.handlers = [];
  }

  add(name, data) {
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