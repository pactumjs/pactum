const Interaction = require('../models/interaction');
const { PactumConfigurationError } = require('../helpers/errors');

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
   */
  start() {
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
    if (typeof port !== 'number') {
      throw new PactumConfigurationError(`Invalid default port number - ${port}`)
    }
    config.mock.port = port;
  }

  /**
   * add a mock interaction to default list
   * @param {Interaction} interaction - mock interaction
   */
  addDefaultMockInteraction(interaction) {
    const interactionObj = new Interaction(interaction, true);
    _server.addMockInteraction(interactionObj.id, interactionObj);
    this.interactionIds.add(interactionObj.id);
    return interactionObj.id;
  }

  /**
   * add mock interactions to default list
   * @param {Interaction[]} interactions - mock interactions array
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
    return ids;
  }

  /**
   * add a pact interaction to default list
   * @param {Interaction} interaction - pact interaction
   */
  addDefaultPactInteraction(interaction) {
    const interactionObj = new Interaction(interaction);
    _server.addPactInteraction(interactionObj.id, interactionObj);
    this.interactionIds.add(interactionObj.id);
    return interactionObj.id;
  }

  /**
   * add pact interactions to default list
   * @param {Interaction[]} interactions - mock interactions array
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
    return ids;
  }

  /**
   * removes specified default interaction from server
   * @param {string} interactionId - id of the interaction 
   */
  removeDefaultInteraction(interactionId) {
    if (typeof interactionId !== 'string' || !interactionId) {
      throw new PactumConfigurationError(`Invalid interaction id - ${interactionId}`)
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
  }

}

module.exports = Mock;