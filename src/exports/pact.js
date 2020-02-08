const fs = require('fs');
const path = require('path');
const phin = require('phin');

const config = require('../config');
const store = require('../helpers/store');
const { PactumConfigurationError } = require('../helpers/errors');

/**
 * @typedef {object} PublishOptions
 * @property {string[]} pactFilesOrDirs - array of pact files or directories
 * @property {string} pactBroker - pact broker url
 * @property {string} consumerVersion - version of the consumer
 * @property {string} pactBrokerUsername - pact broker user name
 * @property {string} pactBrokerPassword - pact broker password
 * @property {string[]} tags - tags
 */

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
    const pactFilesOrDirs = options.pactFilesOrDirs;
    const filePaths = new Set();
    for (let i = 0; i < pactFilesOrDirs.length; i++) {
      const pactFileOrDir = pactFilesOrDirs[i];
      const stats = fs.lstatSync(pactFileOrDir);
      if (stats.isDirectory()) {
        const items = fs.readdirSync(pactFileOrDir);
        for (let j = 0; j < items.length; j++) {
          const item = items[j];
          const itemPath = path.join(pactFileOrDir, item);
          const childPathStats = fs.lstatSync(itemPath);
          if (childPathStats.isDirectory()) {
            const childItems = fs.readdirSync(itemPath);
            for (let k = 0; k < childItems.length; k++) {
              const childItem = childItems[k];
              const childItemPath = path.join(itemPath, childItem);
              const childItemStats = fs.lstatSync(childItemPath);
              if (childItemStats.isFile()) {
                filePaths.add(childItemPath);
              }
            }
          } else {
            filePaths.add(itemPath);
          }
        }
      } else {
        filePaths.add(pactFileOrDir);
      }
    }
    return _publish(filePaths, options);
  }

}

/**
 * internal publish function
 * @param {Set<string>} filePaths - all pact file paths
 * @param {PublishOptions} options - publish options
 */
async function _publish(filePaths, options) {
  const consumers = new Set();
  const { consumerVersion, tags } = options;
  const pactBroker = options.pactBroker || process.env.PACT_BROKER_URL;
  const pactBrokerUsername = options.pactBrokerUsername || process.env.PACT_BROKER_USERNAME;
  const pactBrokerPassword = options.pactBrokerPassword || process.env.PACT_BROKER_PASSWORD;
  for (const filePath of filePaths) {
    const ext = path.extname(filePath);
    if (ext === '.json') {
      const pactFile = require(filePath);
      const consumer = pactFile.consumer.name || config.pact.consumer || process.env.PACTUM_PACT_CONSUMER_NAME;
      const provider = pactFile.provider.name;
      consumers.add(consumer);
      await phin({
        url: `${pactBroker}/pacts/provider/${provider}/consumer/${consumer}/version/${consumerVersion}`,
        method: 'PUT',
        core: {
          auth: `${pactBrokerUsername}:${pactBrokerPassword}`
        },
        data: pactFile
      });
    }
  }
  for (const consumer of consumers) {
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      await phin({
        url: `${pactBroker}/pacticipants/${consumer}/versions/${consumerVersion}/tags/$${tag}`,
        method: 'PUT',
        core: {
          auth: `${pactBrokerUsername}:${pactBrokerPassword}`
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
}

module.exports = Pact;