const Spec = require('./models/Spec');

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

  spec(name, data) {
    return new Spec(name, data);
  }

};

module.exports = pactum;