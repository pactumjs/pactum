require('./plugins/logger').setAdapter(require('./adapters/logger'));
require('./plugins/json.schema').setAdapter(require('./adapters/json.schema'));
require('./plugins/json.match').setAdapter(require('./adapters/json.match'));
require('./plugins/json.like').setAdapter(require('./adapters/json.like'));
require('./plugins/form.data').setAdapter(require('./adapters/form.data'));

const Spec = require('./models/Spec');
const Fuzz = require('./models/Fuzz');
const E2E = require('./models/E2E');

const helper = require('./helpers/helper');

const mock = require('./exports/mock');
const request = require('./exports/request');
const response = require('./exports/response');
const settings = require('./exports/settings');
const handler = require('./exports/handler');
const state = require('./exports/state');
const stash = require('./exports/stash');
const expect = require('./exports/expect');
const reporter = require('./exports/reporter');
const events = require('./exports/events');
const utils = require('./exports/utils');

const processor = require('./helpers/dataProcessor');

function parse(data) {
  processor.processMaps();
  processor.processTemplates();
  return processor.processData(data);
}

const pactum = {

  mock,
  request,
  response,
  settings,
  handler,
  state,
  stash,
  expect,
  reporter,
  events,
  utils,

  spec(name, data, opts) {
    return new Spec(name, data, opts);
  },

  flow(name) {
    if (typeof name !== 'string' || !name) throw `Invalid flow name`;
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
  },

  clone(value) {
    return utils.clone(value);
  },

  parse,

  constants: {
    override: '@OVERRIDES@',
    template: '@DATA:TEMPLATE@',
  }
};

module.exports = pactum;