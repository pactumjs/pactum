const Spec = require('./models/spec');
const Server = require('./models/server');
const Matcher = require('./models/matcher');
const Interaction = require('./models/interaction');
const store = require('./helpers/store');

const config = require('./config');

const server = new Server();
const matchers = new Matcher();

const mock = {

  start(port = config.mock.port) {
    return server.start(port);
  },

  stop(port = config.mock.port) {
    return server.stop(port);
  },

  setDefaultPort(port) {
    config.mock.port = port;
  },

  addDefaultInteraction(interaction) {
    const interactionObj = new Interaction(interaction);
    server.addDefaultInteraction(interactionObj.id, interactionObj);
    return interactionObj.id;
  },

  removeDefaultInteraction(interactionId, port = config.mock.port) {
    server.removeDefaultInteraction(interactionId, port);
  },

  removeDefaultInteractions(port = config.mock.port) {
    server.removeDefaultInteractions(port);
  }

  // stop all servers

}

const pact = {

  setPactFilesDirectory(path) {
    config.pact.dir = path;
  },

  setConsumerName(name) {
    config.pact.consumer = name;
  },

  save() {
    store.save();
  }

  // publish pacts

}

const pactum = {

  mock,
  matchers,
  pact,
  
  /**
   * Add as an interaction to the mock server
   * @param {object} interaction - interaction details
   * @param {string} [interaction.consumer] - name of the consumer
   * @param {string} [interaction.provider] - name of the provider
   * @param {string} [interaction.state] - state of the provider
   * @param {string} [interaction.uponReceiving] - description of the request
   * @param {object} interaction.withRequest - interaction request details
   * @param {string} interaction.withRequest.method - request method
   * @param {string} interaction.withRequest.path - request path
   * @param {object} [interaction.withRequest.headers] - request headers
   * @param {object} [interaction.withRequest.query] - request query
   * @param {object} [interaction.withRequest.body] - request body
   * @param {object} interaction.willRespondWith - interaction response details
   * @param {string} interaction.willRespondWith.status - response status code
   * @param {string} [interaction.willRespondWith.headers] - response headers
   * @param {object} [interaction.willRespondWith.body] - response body
   * @example
   * await pactum
   *  .addInteraction({
   *    consumer: 'our-little-consumer',
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
  addInteraction(interaction) {
    const spec = new Spec(server);
    return spec.addInteraction(interaction);
  },

  /**
   * The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.
   * @param {string} url - HTTP url
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/posts')
   *  .withQuery('postId', 1)
   *  .expectStatus(200)
   *  .expectJsonLike({
   *    userId: 1,
   *    id: 1
   *   })
   *  .toss();
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
   * The OPTIONS method is used to describe the communication options for the target resource.
   * @param {string} url - HTTP url
   */
  options(url) {
    return new Spec(server).options(url);
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
   *  .expectStatus(200)
   *  .toss();
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
   *  .expectStatus(201)
   *  .toss();
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
   *  .expectStatus(200)
   *  .toss();
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
   *  .expectStatus(200)
   *  .toss();
   */
  delete(url) {
    return new Spec(server).delete(url);
  }

};

module.exports = pactum;
