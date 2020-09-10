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

  setState(name, data) {
    return new Spec().setState(name, data);
  },

  useInteraction(interaction) {
    return new Spec().useInteraction(interaction);
  },
  
  useMockInteraction(interaction) {
    return new Spec().useMockInteraction(interaction);
  },

  usePactInteraction(interaction) {
    return new Spec().usePactInteraction(interaction);
  },

  get(url) {
    return new Spec().get(url);
  },

  head(url) {
    return new Spec().head(url);
  },

  patch(url) {
    return new Spec().patch(url);
  },

  post(url) {
    return new Spec().post(url);
  },

  put(url) {
    return new Spec().put(url);
  },

  del(url) {
    return new Spec().del(url);
  }

};

module.exports = pactum;