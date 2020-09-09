const config = require('../config');
const store = require('../helpers/store');
const { PactumConfigurationError } = require('../helpers/errors');

const consumer = {

  setPactFilesDirectory(dir) {
    if (typeof dir !== 'string') {
      throw new PactumConfigurationError(`Invalid directory provided for saving pact files - ${dir}`);
    }
    config.pact.dir = dir;
  },

  setConsumerName(name) {
    if (typeof name !== 'string' || !name) {
      throw new PactumConfigurationError(`Invalid consumer name - ${name}`);
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