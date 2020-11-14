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
const matchers = require('./exports/matcher');
const state = require('./exports/state');
const stash = require('./exports/stash');
const expect = require('./exports/expect');
const reporter = require('./exports/reporter');

const pactum = {

  mock,
  matchers,
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