const Spec = require('./models/Spec');
const Fuzz = require('./models/Fuzz');
const E2E = require('./models/E2E');

const helper = require('./helpers/helper');

const mock = require('./exports/mock');
const consumer = require('./exports/consumer');
const request = require('./exports/request');
const provider = require('./exports/provider');
const settings = require('./exports/settings');
const handler = require('./exports/handler');
const state = require('./exports/state');
const stash = require('./exports/stash');
const expect = require('./exports/expect');
const reporter = require('./exports/reporter');

const pactum = {

  mock,
  consumer,
  request,
  provider,
  settings,
  handler,
  state,
  stash,
  expect,
  reporter,

  spec(name, data) {
    return new Spec(name, data);
  },

  flow(name) {
    const spec = new Spec();
    spec.flow = name;
    return spec;
  },

  fuzz() {
    return new Fuzz();
  },

  e2e(name) {
    return new E2E(name);
  },

  sleep(ms) {
    return helper.sleep(ms);
  }

};

module.exports = pactum;