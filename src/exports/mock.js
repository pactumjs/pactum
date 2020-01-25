const Interaction = require('../models/interaction');
const { PactumConfigurationError } = require('../helpers/errors');

const config = require('../config');

/**
 * interaction details
 * @typedef {object} Interaction
 * @property {string} [consumer] - name of the consumer
 * @property {string} [provider] - name of the provider
 * @property {string} [state] - state of the provider
 * @property {string} [uponReceiving] - description of the request
 * @property {object} withRequest - interaction request details
 * @property {string} withRequest.method - request method
 * @property {string} withRequest.path - request path
 * @property {object} [withRequest.headers] - request headers
 * @property {object} [withRequest.query] - request query
 * @property {object} [withRequest.body] - request body
 * @property {boolean} [withRequest.ignoreBody] - ignores request body while matching
 * @property {object} willRespondWith - interaction response details
 * @property {string} willRespondWith.status - response status code
 * @property {string} [willRespondWith.headers] - response headers
 * @property {object} [willRespondWith.body] - response body
 */

let _server;
const interactions = new Map();

class Mock {

  constructor(ser) {
    if (typeof ser !== 'object' || ser === null) {
      throw new PactumConfigurationError(`Invalid server provided to mock - ${ser}`);
    }
    _server = ser;
  }

  /**
   * starts server on specified port or defaults to 9393
   * @param {number} [port=9393] - port number of mock server
   */
  start(port = config.mock.port) {
    if (typeof port !== 'number') {
      throw new PactumConfigurationError(`Invalid port number given to start the mock server - ${port}`)
    }
    return _server.start(port);
  }

  /**
   * stops server on specified port or defaults to 9393
   * @param {number} [port=9393] - port number of mock server
   */
  stop(port = config.mock.port) {
    if (typeof port !== 'number') {
      throw new PactumConfigurationError(`Invalid port number given to stop the mock server - ${port}`)
    }
    return _server.stop(port);
  }

  /**
   * set default port number to run mock server
   * @param {number} port - port number of mock server
   */
  setDefaultPort(port) {
    if (typeof port !== 'number') {
      throw new PactumConfigurationError(`Invalid default port number - ${port}`)
    }
    config.mock.port = port;
  }

  /**
   * add an mock interaction to default list
   * @param {Interaction} interaction - mock interaction
   */
  addDefaultMockInteraction(interaction) {
    const interactionObj = new Interaction(interaction, true);
    _server.addDefaultInteraction(interactionObj.id, interactionObj);
    return interactionObj.id;
  }

  /**
   * add an mock interaction to default list
   * @param {Interaction} interaction - mock interaction
   */
  addDefaultPactInteraction(interaction) {
    const interactionObj = new Interaction(interaction);
    interactions.set(interactionObj.id, interactionObj);
    _server.addDefaultInteraction(interactionObj.id, interactionObj);
    return interactionObj.id;
  }

  /**
   * removes specified default mock interaction from server
   * @param {string} interactionId - id of the interaction
   * @param {number} port - port number of mock server 
   */
  removeDefaultInteraction(interactionId, port = config.mock.port) {
    if (typeof interactionId !== 'string' || !interactionId) {
      throw new PactumConfigurationError(`Invalid interaction id - ${interactionId}`)
    }
    if (typeof port !== 'number') {
      throw new PactumConfigurationError(`Invalid port number - ${port}`)
    }
    _server.removeDefaultInteraction(interactionId, port);
  }

  /**
   * removes all default mock interactions
   * @param {number} port - port number of mock server
   */
  removeDefaultInteractions(port = config.mock.port) {
    _server.removeDefaultInteractions(port);
  }

  // stop all _servers

}

module.exports = Mock;