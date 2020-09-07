const State = require('../models/State');

const state = {

  set(name, data) {
    const s = new State();
    s.add(name, data);
    return s.set();
  }

};

module.exports = state;