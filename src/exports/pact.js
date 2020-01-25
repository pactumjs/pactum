const config = require('../config');
const store = require('../helpers/store');
const { PactumConfigurationError } = require('../helpers/errors');

class Pact {

  /**
   * sets directory for saving pact files
   * @param {string} dir - directory for saving pact files
   * @default './pacts/'
   */
  setPactFilesDirectory(dir) {
    if (typeof dir !== 'string') {
      throw new PactumConfigurationError(`Invalid directory for saving pact files - ${dir}`);
    }
    config.pact.dir = dir;
  }

  /**
   * sets the name of the consumer
   * @param {string} name - name of the consumer
   */
  setConsumerName(name) {
    if (typeof name !== 'string' || name) {
      throw new PactumConfigurationError(`Invalid consumer name - ${name}`);
    }
    config.pact.consumer = name;
  }

  /**
   * saves the pact files in the specified directory
   */
  save() {
    store.save();
  }

  // publish pacts
}

module.exports = Pact;