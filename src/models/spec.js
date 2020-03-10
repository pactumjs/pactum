const phin = require('phin');
const FormData = require('form-data');
const Expect = require('./expect');
const Interaction = require('./interaction');
const helper = require('../helpers/helper');
const log = require('../helpers/logger');
const { PactumRequestError } = require('../helpers/errors');
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

class Spec {

  constructor(server) {
    this.id = helper.getRandomId();
    this.server = server;
    this.mockInteractions = new Map();
    this.pactInteractions = new Map();
    this._request = {};
    this._response = {};
    this._expect = new Expect();
  }

  fetch() {
    const query = helper.getPlainQuery(this._request.qs);
    if (query) {
      this._request.url = this._request.url + '?' + query;
    }
    setBaseUrl(this._request);
    this._request.timeout = config.request.timeout;
    setHeaders(this._request);
    setMultiPartFormData(this._request);
    return phin(this._request);
  }

  /**
   * Add as an interaction to the mock server
   * @param {Interaction} rawInteraction - interaction details
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
    this.mockInteractions.set(interaction.id, interaction);
    return this;
  }

  /**
   * Add as an interaction to the mock server
   * @param {Interaction} rawInteraction - interaction details
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
    this.pactInteractions.set(interaction.id, interaction);
    return this;
  }

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
    validateRequestUrl(this._request, url);
    this._request.url = url;
    this._request.method = 'GET';
    return this;
  }

  /**
   * The HEAD method asks for a response identical to that of a GET request, but without the response body.
   * @param {string} url - HTTP url
   */
  head(url) {
    validateRequestUrl(this._request, url);
    this._request.url = url;
    this._request.method = 'HEAD';
    return this;
  }

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
    validateRequestUrl(this._request, url);
    this._request.url = url;
    this._request.method = 'PATCH';
    return this;
  }

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
    validateRequestUrl(this._request, url);
    this._request.url = url;
    this._request.method = 'POST';
    return this;
  }

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
    validateRequestUrl(this._request, url);
    this._request.url = url;
    this._request.method = 'PUT';
    return this;
  }

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
    validateRequestUrl(this._request, url);
    this._request.url = url;
    this._request.method = 'DELETE';
    return this;
  }

  /**
   * appends query param to the request url - /comments?postId=1
   * @param {string} key - query parameter key
   * @param {string} value - query parameter value
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/comments')
   *  .withQuery('postId', '1')
   *  .withQuery('userId', '2')
   *  .expectStatus(200)
   *  .toss();
   * @summary generated url will look like - /comments?postId=1&userId=2
   */
  withQuery(key, value) {
    if (!helper.isValidString(key)) {
      throw new PactumRequestError(`Invalid key in query parameter for request - ${key}`);
    }
    if (value === undefined || value === null) {
      throw new PactumRequestError(`Invalid value in query parameter for request - ${value}`);
    }
    if (this._request.qs === undefined) {
      this._request.qs = {};
    }
    this._request.qs[key] = value;
    return this;
  }

  /**
   * appends graphQL query to the request body
   * @param {string} query - graphQL query
   * @example
   * await pactum
   *  .post('http://www.graph.com/graphql')
   *  .withGraphQLQuery(`{ hello }`)
   *  .expectStatus(200)
   *  .toss();
   */
  withGraphQLQuery(query) {
    if (typeof query !== 'string') {
      throw new PactumRequestError(`Invalid graphQL query - ${query}`);
    }
    if (!this._request.data) {
      this._request.data = {};
    }
    this._request.data.query = query;
    return this;
  }

  /**
   * appends graphQL variables to the request body
   * @param {object} variables - JSON object of graphQL variables
   * @example
   * await pactum
   *  .post('http://www.graph.com/graphql')
   *  .withGraphQLQuery(`
   *    hero(episode: $episode) {
   *      name
   *    }`
   *  )
   *  .withGraphQLVariables({
   *    "episode": "JEDI"
   *  })
   *  .expectStatus(200)
   *  .toss();
   */
  withGraphQLVariables(variables) {
    if (!helper.isValidObject(variables)) {
      throw new PactumRequestError(`Invalid graphQL variables - ${variables}`);
    }
    if (!this._request.data) {
      this._request.data = {};
    }
    this._request.data.variables = variables;
    return this;
  }

  /**
   * attaches json object to the request body
   * @param {object} json - json object
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
  withJson(json) {
    if (typeof json !== 'object') {
      throw new PactumRequestError(`Invalid json in request - ${json}`);
    }
    this._request.data = json;
    return this;
  }

  /**
   * attaches headers to the request
   * @param {object} headers - request headers with key-value pairs
   * @example
   * await pactum
   *  .post('https://jsonplaceholder.typicode.com/posts')
   *  .withHeaders({
   *    'content-type': 'application/json'
   *  })
   *  .withJson({
   *    title: 'foo',
   *    body: 'bar',
   *    userId: 1
   *  })
   *  .expectStatus(201)
   *  .toss();
   */
  withHeaders(headers) {
    if (!helper.isValidObject(headers)) {
      throw new PactumRequestError(`Invalid headers in request - ${headers}`);
    }
    this._request.headers = headers;
    return this;
  }

  /**
   * attaches body to the request
   * @param {string|Buffer} body - request body
   * @example
   * await pactum
   *  .post('https://jsonplaceholder.typicode.com/posts')
   *  .withBody(JSON.stringify({
   *    title: 'foo',
   *  }))
   *  .expectStatus(201)
   *  .toss();
   */
  withBody(body) {
    if (typeof this._request.data !== 'undefined') {
      throw new PactumRequestError(`Duplicate body in request - ${this._request.data}`);
    }
    this._request.data = body;
    return this;
  }

  /**
   * attaches form data to the request with header - "application/x-www-form-urlencoded"
   * @param {object} form - form object
   * @example
   * await pactum
   *   .post('https://jsonplaceholder.typicode.com/posts')
   *   .withFormData({
   *     'user': 'drake'
   *   })
   *   .expectStatus(200)
   *   .toss()
   */
  withForm(form) {
    if (!helper.isValidObject(form)) {
      throw new PactumRequestError(`Invalid form provided - ${form}`);
    }
    if (typeof this._request.form !== 'undefined') {
      throw new PactumRequestError(`Duplicate form in request`);
    }
    this._request.form = form;
    return this;
  }

  /**
   * attaches multi part form data to the request with header - "multipart/form-data"
   * @param {string|FormData} key - key to append
   * @param {string|Buffer|Array|ArrayBuffer} value - value to append
   * @param {FormData.AppendOptions} [options] - form data append options
   * @see https://www.npmjs.com/package/form-data
   * @example
   *  await pactum
   *   .post('https://jsonplaceholder.typicode.com/upload')
   *   .withMultiPartFormData('file', fs.readFileSync(path), { contentType: 'application/xml', filename: 'jUnit.xml' })
   *   .withMultiPartFormData('user', 'drake')
   *   .expectStatus(200)
   *   .toss()
   *
   * @example
   * const form = new pactum.request.FormData();
   * form.append('my_file', fs.readFileSync(path), { contentType: 'application/xml', filename: 'jUnit.xml' });
   * await pactum
   *  .post('https://jsonplaceholder.typicode.com/upload')
   *  .withMultiPartFormData(form)
   *  .expectStatus(200)
   *  .toss()
   */
  withMultiPartFormData(key, value, options) {
    if (key instanceof FormData) {
      this._request._multiPartFormData = key;
    } else {
      if (this._request._multiPartFormData === undefined) {
        this._request._multiPartFormData = new FormData();
      }
      this._request._multiPartFormData.append(key, value, options);
    }
    return this;
  }

  /**
   * expects a status code on the response
   * @param {number} statusCode - expected HTTP stats code
   * @example
   * await pactum
   *  .delete('https://jsonplaceholder.typicode.com/posts/1')
   *  .expectStatus(200)
   *  .toss();
   */
  expectStatus(statusCode) {
    this._expect.statusCode = statusCode;
    return this;
  }

  /**
   * expects a header in the response
   * @param {string} header - expected header key
   * @param {string} value - expected header value
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/posts/1')
   *  .expectHeader('content-type', 'application/json; charset=utf-8')
   *  .expectHeader('connection', /\w+/)
   *  .toss();
   */
  expectHeader(header, value) {
    this._expect.headers.push({
      key: header,
      value
    });
    return this;
  }

  /**
   * expects a header in the response
   * @param {string} header - expected header value
   * @param {string} value - expected header value
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/comments')
   *  .expectHeaderContains('content-type', 'application/json')
   *  .toss();
   */
  expectHeaderContains(header, value) {
    this._expect.headerContains.push({
      key: header,
      value
    });
    return this;
  }

  expectBody(body) {
    this._expect.body = body;
    return this;
  }

  expectBodyContains(value) {
    this._expect.bodyContains.push(value);
    return this;
  }

  /**
   * expects a exact json object in the response
   * @param {object} json - expected json object
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/posts/1')
   *  .expectJson({
   *    userId: 1,
   *    user: 'frank'
   *  })
   *  .toss();
   */
  expectJson(json) {
    this._expect.json.push(json);
    return this;
  }

  /**
   * expects a partial json object in the response
   * @param {object} json - expected json object
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/comments')
   *  .expectJsonLike([{
   *    postId: 1,
   *    id: 1,
   *    name: /\w+/g
   *  }])
   *  .toss();
   */
  expectJsonLike(json) {
    this._expect.jsonLike.push(json);
    return this;
  }

  /**
   * expects the response to match with json schema
   * @param {object} schema - expected JSON schema
   * @see https://json-schema.org/learn/
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/posts/1')
   *  .expectJsonSchema({
   *    "properties": {
   *      "userId": {
   *        "type": "number"
   *      }
   *    },
   *    "required": ["userId", "id"]
   *  })
   *  .toss()
   */
  expectJsonSchema(schema) {
    this._expect.jsonSchema.push(schema);
    return this;
  }

  expectJsonQuery(path, value) {
    this._expect.jsonQuery.push({ path, value });
    return this;
  }

  /**
   * expects request completes within a specified duration (ms)
   * @param {number} value - response time in milliseconds
   */
  expectResponseTime(value) {
    this._expect.responseTime = value;
    return this;
  }

  /**
   * executes the test case
   */
  async toss() {
    if (!helper.isValidString(this._request.url)) {
      throw new PactumRequestError(`Invalid request url - ${this._request.url}`);
    }
    for (const [id, interaction] of this.mockInteractions) {
      this.server.addMockInteraction(id, interaction);
    }
    for (const [id, interaction] of this.pactInteractions) {
      this.server.addPactInteraction(id, interaction);
    }
    const requestStartTime = Date.now();
    let failed = false;
    let err = null;
    try {
      this._response = await this.fetch();
    } catch (error) {
      if (error.response) {
        this._response = error.response;
      } else {
        failed = true;
        err = error;
        log.warn('Error performing request', error);
        this._response = error;
      }
    }
    this._response.responseTime = Date.now() - requestStartTime;
    for (const [id, interaction] of this.mockInteractions) {
      this.server.removeInteraction(id);
    }
    for (const [id, interaction] of this.pactInteractions) {
      this.server.removeInteraction(id);
    }
    this._response.json = helper.getJson(this._response.body);
    if (failed) {
      this._expect.fail(err);
    }
    this._expect.validateInteractions(this.mockInteractions);
    this._expect.validateInteractions(this.pactInteractions);
    this._expect.validate(this._response);
    return this._response;
  }

  then(resolve, reject) {
    this.toss()
      .then(res => resolve(res))
      .catch(err => reject(err));
  }

}

function validateRequestUrl(request, url) {
  if (request.url && request.method) {
    throw new PactumRequestError(`Duplicate request initiated. Existing request - ${request.method} ${request.url}`);
  }
  if (!helper.isValidString(url)) {
    throw new PactumRequestError(`Invalid request url - ${url}`);
  }
}

function setHeaders(request) {
  if (config.request.headers && Object.keys(config.request.headers).length > 0) {
    if (!request.headers) {
      request.headers = {};
    }
    for (const prop in config.request.headers) {
      if (request.headers[prop]) {
        continue;
      } else {
        request.headers[prop] = config.request.headers[prop];
      }
    }
  }
}

function setBaseUrl(request) {
  if (config.request.baseUrl) {
    request.url = config.request.baseUrl + request.url;
  }
}

function setMultiPartFormData(request) {
  if (request._multiPartFormData) {
    request.data = request._multiPartFormData.getBuffer();
    const multiPartHeaders = request._multiPartFormData.getHeaders();
    if (!request.headers) {
      request.headers = multiPartHeaders;
    } else {
      for (const prop in multiPartHeaders) {
        request.headers[prop] = multiPartHeaders[prop];
      }
    }
    delete request._multiPartFormData;
  }
}

module.exports = Spec;
