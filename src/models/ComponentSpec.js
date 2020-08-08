const Spec = require('./Spec');
const Interaction = require('./interaction');
const Tosser = require('./Tosser');
const helper = require('../helpers/helper');
const log = require('../helpers/logger');
const { PactumRequestError } = require('../helpers/errors');

/**
 * request method
 * @typedef {('GET'|'POST'|'PUT'|'DELETE'|'PATCH'|'HEAD')} RequestMethod
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

class ComponentSpec extends Spec {

  constructor(server) {
    super();
    this.server = server;
    this.mockInteractions = new Map();
    this.pactInteractions = new Map();
  }

  /**
   * Add as an interaction to the mock server
   * @param {MockInteraction} rawInteraction - interaction details
   * @example
   * await pactum
   *  .addMockInteraction({
   *    withRequest: {
   *      method: 'GET',
   *      path: '/api/projects/1'
   *    },
   *    willRespondWith: {
   *      status: 200,
   *      headers: {
   *        'Content-Type': 'application/json'
   *      },
   *      body: {
   *        id: 1,
   *        name: 'fake'
   *      }
   *    }
   *  })
   *  .get('https://jsonplaceholder.typicode.com/posts')
   *  .expectStatus(200)
   *  .expectJsonLike({
   *    userId: 1,
   *    id: 1
   *   })
   *  .toss();
   */
  addMockInteraction(rawInteraction) {
    const interaction = new Interaction(rawInteraction, true);
    log.debug('Mock Interaction added to Mock Server -', interaction.id);
    this.mockInteractions.set(interaction.id, interaction);
    return this;
  }

  /**
   * Add as an interaction to the mock server
   * @param {PactInteraction} rawInteraction - interaction details
   * @example
   * await pactum
   *  .addPactInteraction({
   *    provider: 'project-provider',
   *    state: 'when there is a project with id 1',
   *    uponReceiving: 'a request for project 1',
   *    withRequest: {
   *      method: 'GET',
   *      path: '/api/projects/1'
   *    },
   *    willRespondWith: {
   *      status: 200,
   *      headers: {
   *        'Content-Type': 'application/json'
   *      },
   *      body: {
   *        id: 1,
   *        name: 'fake'
   *      }
   *    }
   *  })
   *  .get('https://jsonplaceholder.typicode.com/posts')
   *  .expectStatus(200)
   *  .expectJsonLike({
   *    userId: 1,
   *    id: 1
   *   })
   *  .toss();
   */
  addPactInteraction(rawInteraction) {
    const interaction = new Interaction(rawInteraction, false);
    log.debug('Pact Interaction added to Mock Server -', interaction.id);
    this.pactInteractions.set(interaction.id, interaction);
    return this;
  }

  /**
   * executes the test case
   */
  async toss() {
    const tosser = new Tosser({
      request: this._request,
      server: this.server,
      expect: this._expect,
      mockInteractions: this.mockInteractions,
      pactInteractions: this.pactInteractions,
      previousLogLevel: this.previousLogLevel
    });
    tosser.updateRequest();
    tosser.addInteractionsToServer();
    await tosser.setResponse();
    tosser.setPreviousLogLevel();
    tosser.removeInteractionsFromServer();
    tosser.validateError();
    tosser.validateInteractions();
    tosser.validateResponse();
    return tosser.response;
  }

}

module.exports = ComponentSpec;