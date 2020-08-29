const Spec = require('./models/Spec');
const Server = require('./models/server');
const Matcher = require('./models/matcher');

const Mock = require('./exports/mock');
const Pact = require('./exports/pact');
const request = require('./exports/request');
const provider = require('./exports/provider');
const Settings = require('./exports/settings');
const handler = require('./exports/handler');

const logger = require('./helpers/logger');

/**
 * request method
 * @typedef {('GET'|'POST'|'PUT'|'DELETE'|'PATCH'|'HEAD')} RequestMethod
 */

/**
 * basic mock interaction
 * @typedef {object} BasicInteraction
 * @property {string} [get] - get request path
 * @property {string} [post] - post request path
 * @property {string} [put] - put request path
 * @property {string} [patch] - patch request path
 * @property {string} [delete] - delete request path
 * @property {number} [status=200] - status code to return
 * @property {any}  [return=''] - body to return 
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
 * @property {string} path - request path
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

const server = new Server();
const matchers = new Matcher();
const mock = new Mock(server);
const pact = new Pact();
const settings = new Settings(pact, request, mock, logger);

const pactum = {

  mock,
  matchers,
  pact,
  request,
  provider,
  settings,
  handler,

  /**
   * runs the specified state handler
   * @param {string} name - name of the state handler
   * @param {any} data - data to be passed to the context
   * @example
   * await pactum
   *  .setState('there are users in the system')
   *  .get('/api/users')
   *  .expectStatus(200);
   */
  setState(name, data) {
    const spec = new Spec(server);
    return spec.setState(name, data);
  },

  /**
   * adds a mock interaction to the server
   * @param {BasicInteraction} interaction 
   * @see addMockInteraction for more options
   * @example
   * await pactum
   *  .addInteraction({
   *    get: '/api/address/4'
   *    return: {
   *      city: 'WinterFell'
   *    }
   *  })
   *  .get('/api/users/4')
   *  .expectStatus(200);
   */
  addInteraction(interaction) {
    const spec = new Spec(server);
    return spec.addInteraction(interaction);
  },

  /**
   * adds a mock interaction to the server
   * @param {MockInteraction} interaction - interaction details
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
   *   });
   */
  addMockInteraction(interaction) {
    const spec = new Spec(server);
    return spec.addMockInteraction(interaction);
  },

  /**
   * adds a pact interaction to the server
   * @param {PactInteraction} interaction - interaction details
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
   *   });
   */
  addPactInteraction(interaction) {
    const spec = new Spec(server);
    return spec.addPactInteraction(interaction);
  },

  /**
   * The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.
   * @param {string} url - HTTP url
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/posts')
   *  .withQueryParam('postId', 1)
   *  .expectStatus(200)
   *  .expectJsonLike({
   *    userId: 1,
   *    id: 1
   *   });
   */
  get(url) {
    return new Spec(server).get(url);
  },

  /**
   * The HEAD method asks for a response identical to that of a GET request, but without the response body.
   * @param {string} url - HTTP url
   */
  head(url) {
    return new Spec(server).head(url);
  },

  /**
   * The PATCH method is used to apply partial modifications to a resource.
   * @param {string} url - HTTP url
   * @example
   * await pactum
   *  .patch('https://jsonplaceholder.typicode.com/posts/1')
   *  .withJson({
   *    title: 'foo'
   *  })
   *  .expectStatus(200);
   */
  patch(url) {
    return new Spec(server).patch(url);
  },

  /**
   * The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
   * @param {string} url - HTTP url
   * @example
   * await pactum
   *  .post('https://jsonplaceholder.typicode.com/posts')
   *  .withJson({
   *    title: 'foo',
   *    body: 'bar',
   *    userId: 1
   *  })
   *  .expectStatus(201);
   */
  post(url) {
    return new Spec(server).post(url);
  },

  /**
   * The PUT method replaces all current representations of the target resource with the request payload.
   * @param {string} url - HTTP url
   * @example
   * await pactum
   *  .put('https://jsonplaceholder.typicode.com/posts/1')
   *  .withJson({
   *    id: 1,
   *    title: 'foo',
   *    body: 'bar',
   *    userId: 1
   *  })
   *  .expectStatus(200);
   */
  put(url) {
    return new Spec(server).put(url);
  },

  /**
   * The DELETE method deletes the specified resource.
   * @param {string} url - HTTP url
   * @example
   * await pactum
   *  .delete('https://jsonplaceholder.typicode.com/posts/1')
   *  .expectStatus(200);
   */
  delete(url) {
    return new Spec(server).delete(url);
  }

};

module.exports = pactum;
