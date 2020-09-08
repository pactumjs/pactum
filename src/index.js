const Spec = require('./models/Spec');

const mock = require('./exports/mock');
const pact = require('./exports/pact');
const request = require('./exports/request');
const provider = require('./exports/provider');
const settings = require('./exports/settings');
const handler = require('./exports/handler');
const matchers = require('./exports/matcher');
const state = require('./exports/state');
const bin = require('./exports/bin');

const pactum = {

  mock,
  matchers,
  pact,
  request,
  provider,
  settings,
  handler,
  state,
  bin,

  setState(name, data) {
    return new Spec().setState(name, data);
  },

  addInteraction(interaction) {
    return new Spec().addInteraction(interaction);
  },
  
  addMockInteraction(interaction) {
    return new Spec().addMockInteraction(interaction);
  },

  addPactInteraction(interaction) {
    return new Spec().addPactInteraction(interaction);
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

  /**
   * The DELETE method deletes the specified resource.
   * @param {string} url - HTTP url
   * @example
   * await pactum
   *  .del('https://jsonplaceholder.typicode.com/posts/1')
   *  .expectStatus(200);
   */
  del(url) {
    return new Spec().del(url);
  }

};

module.exports = pactum;