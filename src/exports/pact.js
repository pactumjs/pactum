const config = require('../config');
const store = require('../helpers/store');
const { PactumConfigurationError } = require('../helpers/errors');

/**
 * @typedef {object} PublishOptions
 * @property {string[]} pactFilesOrDirs - array of pact files or directories (PACT_DIR)
 * @property {string} pactBroker - pact broker url (PACT_BROKER_URL)
 * @property {string} consumerVersion - version of the consumer
 * @property {string} pactBrokerUsername - pact broker user name (PACT_BROKER_USERNAME)
 * @property {string} pactBrokerPassword - pact broker password (PACT_BROKER_PASSWORD)
 * @property {string[]} tags - tags
 */

class Pact {

  /**
   * @alias PACT_DIR
   * 
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
   * @alias PACT_CONSUMER_NAME
   * 
   * sets the name of the consumer
   * @param {string} name - name of the consumer
   */
  setConsumerName(name) {
    if (typeof name !== 'string' || !name) {
      throw new PactumConfigurationError(`Invalid consumer name - ${name}`);
    }
    config.pact.consumer = name;
  }

  /**
   * saves all the contracts(pact files) in the specified directory
   */
  save() {
    store.save();
  }

  /**
   * publish pact files to pact broker
   * @param {PublishOptions} options - publish options
   */
  publish(options) {
    return store.publish(options);
  }

}

module.exports = Pact;