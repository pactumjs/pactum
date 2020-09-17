const config = require('../config');
const store = require('../helpers/store');
const { PactumConfigurationError } = require('../helpers/errors');

const consumer = {

  setPactFilesDirectory(dir) {
    if (typeof dir !== 'string') {
      throw new PactumConfigurationError('`dir` is required');
    }
    config.pact.dir = dir;
  },

  setConsumerName(name) {
    if (typeof name !== 'string' || !name) {
      throw new PactumConfigurationError('`name` is required');
    }
    config.pact.consumer = name;
  },

  save() {
    store.save();
  },

  publish(options) {
    return store.publish(options);
  }

}

module.exports = consumer;