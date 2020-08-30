const State = require('../models/State');

const state = {

  /**
   * runs the specified state handler
   * @param {string} name - name of the state handler
   * @param {any} [data] - data to be passed to the context
   * @example
   * await state.set('there is a user in system');
   * await state.set('there is a user in system with', { id: 1, name: 'stark' });
   */
  set(name, data) {
    const s = new State();
    s.add(name, data);
    return s.set();
  }

};

module.exports = state;