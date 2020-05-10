const Interaction = require('../models/interaction');
const { PactumConfigurationError } = require('../helpers/errors');
const log = require('../helpers/logger');

const config = require('../config');

/**
 * request method
 * @typedef {('GET'|'POST'|'PUT'|'DELETE'|'PATCH'|'HEAD')} RequestMethod
 */

/**
 * interaction details
 * @typedef {object} Interaction
 * @property {string} [id] - unique id of the interaction
 * @property {string} [consumer] - name of the consumer
 * @property {string} [provider] - name of the provider
 * @property {string} [state] - state of the provider
 * @property {string} [uponReceiving] - description of the request
 * @property {object} withRequest - interaction request details
 * @property {RequestMethod} withRequest.method - request method
 * @property {string} withRequest.path - request path
 * @property {object} [withRequest.headers] - request headers
 * @property {object} [withRequest.query] - request query
 * @property {object} [withRequest.graphQL] - graphQL request
 * @property {string} withRequest.graphQL.query - graphQL query
 * @property {object} [withRequest.graphQL.variables] - graphQL variables
 * @property {object} [withRequest.body] - request body
 * @property {boolean} [withRequest.ignoreQuery] - ignores request query while matching
 * @property {boolean} [withRequest.ignoreBody] - ignores request body while matching
 * @property {object} willRespondWith - interaction response details
 * @property {string} willRespondWith.status - response status code
 * @property {string} [willRespondWith.headers] - response headers
 * @property {object} [willRespondWith.body] - response body
 */

/**
 * pact interaction details
 * @typedef {object} PactInteraction
 * @property {string} [id] - unique id of the interaction
 * @property {string} provider - name of the provider
 * @property {string} state - state of the provider
 * @property {string} uponReceiving - description of the request
 * @property {PactInteractionRequest} withRequest - interaction request details
 * @property {PactInteractionResponse} willRespondWith - interaction response details
 */

/**
 * mock interaction details
 * @typedef {object} MockInteraction
 * @property {string} [id] - unique id of the interaction
 * @property {string} [provider] - name of the provider
 * @property {MockInteractionRequest} withRequest - interaction request details
 * @property {MockInteractionResponse} willRespondWith - interaction response details
 */

/**
 * pact interaction request details
 * @typedef {object} PactInteractionRequest
 * @property {RequestMethod} method - request method
 * @property {string} path - request method
 * @property {object} [headers] - request headers
 * @property {object} [query] - request query
 * @property {GraphQLRequest} [graphQL] - graphQL request
 * @property {object} [body] - request body
 */


/**
 * @typedef {Object} MockInteractionRequestType
 * @property {boolean} ignoreQuery - ignores request query while matching
 * @property {boolean} ignoreBody - ignores request body while matching
 *
 * mock interaction request details
 * @typedef {PactInteractionRequest & MockInteractionRequestType} MockInteractionRequest
 */

/**
 * graphQL request details
 * @typedef {object} GraphQLRequest
 * @property {string} query - graphQL query
 * @property {string} [variables] - graphQL variables
 */

/**
 * pact interaction response details
 * @typedef {object} PactInteractionResponse
 * @property {number} status - response status code
 * @property {object} [headers] - response headers
 * @property {object} [body] - response body
 */

/**
 * @typedef {Object} MockInteractionResponseType
 * @property {number} [fixedDelay] - response fixed delay in ms
 * @property {object} [randomDelay] - response random delay
 * @property {number} randomDelay.min - min delay in ms
 * @property {number} randomDelay.max - max delay in ms
 * @property {Object.<number, MockInteractionResponse>} onCall - behavior on consecutive calls
 *
 * mock interaction response details
 * @typedef {PactInteractionResponse & MockInteractionResponseType} MockInteractionResponse
 */

let _server;

class Mock {

  constructor(ser) {
    if (typeof ser !== 'object' || ser === null) {
      throw new PactumConfigurationError(`Invalid server provided to mock - ${ser}`);
    }
    _server = ser;
    this.interactionIds = new Set();
  }

  /**
   * starts server on specified port or defaults to 9393
   * @param {number} port - port number of mock server
   */
  start(port) {
    if (port) {
      this.setDefaultPort(port);
    }
    return _server.start();
  }

  /**
   * stops server on specified port or defaults to 9393
   */
  stop() {
    return _server.stop();
  }

  /**
   * set default port number to run mock server
   * @param {number} port - port number of mock server
   */
  setDefaultPort(port) {
    log.debug('Setting default port number for mock server', port);
    if (typeof port !== 'number') {
      throw new PactumConfigurationError(`Invalid default port number - ${port}`);
    }
    config.mock.port = port;
  }

  /**
   * add a mock interaction to default list
   * @param {MockInteraction} interaction - mock interaction
   */
  addDefaultMockInteraction(interaction) {
    const interactionObj = new Interaction(interaction, true);
    _server.addMockInteraction(interactionObj.id, interactionObj);
    this.interactionIds.add(interactionObj.id);
    log.debug('Added default mock interaction with id', interactionObj.id);
    return interactionObj.id;
  }

  /**
   * add mock interactions to default list
   * @param {MockInteraction[]} interactions - mock interactions array
   */
  addDefaultMockInteractions(interactions) {
    if (!Array.isArray(interactions)) {
      // use a new type of error
      throw new PactumConfigurationError(`Invalid mock interactions array passed - ${interactions}`);
    }
    const ids = [];
    for (let i = 0; i < interactions.length; i++) {
      const interactionObj = new Interaction(interactions[i], true);
      _server.addMockInteraction(interactionObj.id, interactionObj);
      ids.push(interactionObj.id);
      this.interactionIds.add(interactionObj.id);
    }
    log.debug('Added default mock interactions with ids', ids);
    return ids;
  }

  /**
   * add a pact interaction to default list
   * @param {PactInteraction} interaction - pact interaction
   */
  addDefaultPactInteraction(interaction) {
    const interactionObj = new Interaction(interaction);
    _server.addPactInteraction(interactionObj.id, interactionObj);
    this.interactionIds.add(interactionObj.id);
    log.debug('Added default pact interactions with id', interactionObj.id);
    return interactionObj.id;
  }

  /**
   * add pact interactions to default list
   * @param {PactInteraction[]} interactions - mock interactions array
   */
  addDefaultPactInteractions(interactions) {
    if (!Array.isArray(interactions)) {
      // use a new type of error
      throw new PactumConfigurationError(`Invalid pact interactions array passed - ${interactions}`);
    }
    const ids = [];
    for (let i = 0; i < interactions.length; i++) {
      const interactionObj = new Interaction(interactions[i], false);
      _server.addPactInteraction(interactionObj.id, interactionObj);
      ids.push(interactionObj.id);
      this.interactionIds.add(interactionObj.id);
    }
    log.debug('Added default pact interactions with ids', ids);
    return ids;
  }

  /**
   * removes specified default interaction from server
   * @param {string} interactionId - id of the interaction
   */
  removeDefaultInteraction(interactionId) {
    if (typeof interactionId !== 'string' || !interactionId) {
      throw new PactumConfigurationError(`Invalid interaction id - ${interactionId}`);
    }
    _server.removeInteraction(interactionId);
  }

  /**
   * removes all default interactions
   */
  clearDefaultInteractions() {
    const ids = [];
    for (const id of this.interactionIds) {
      ids.push(id);
      _server.removeInteraction(id);
    }
    for (let i = 0; i < ids.length; i++) {
      this.interactionIds.delete(ids[i]);
    }
    log.debug('Cleared default interactions with ids', ids);
  }

}

module.exports = Mock;