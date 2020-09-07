const FormData = require('form-data');
const Tosser = require('./Tosser');
const Expect = require('./expect');
const State = require('./State');
const Interaction = require('./interaction');
const helper = require('../helpers/helper');
const log = require('../helpers/logger');
const { PactumRequestError } = require('../helpers/errors');
const mock = require('../exports/mock');

class Spec {

  constructor() {
    this.id = helper.getRandomId();
    this._request = {};
    this._response = {};
    this._returns = [];
    this._expect = new Expect();
    this._state = new State();
    this.previousLogLevel = null;
    this.server = mock._server;
    this.mockInteractions = new Map();
    this.pactInteractions = new Map();
  }

  setState(name, data) {
    this._state.add(name, data);
    return this;
  }

  addInteraction(basicInteraction) {
    const rawInteraction = {
      withRequest: helper.getRequestFromBasicInteraction(basicInteraction),
      willRespondWith: {
        status: basicInteraction.status || 200,
        body: basicInteraction.return || ''
      }
    };
    return this.addMockInteraction(rawInteraction);
  }

  addMockInteraction(rawInteraction) {
    const interaction = new Interaction(rawInteraction, true);
    log.debug('Mock Interaction added to Mock Server -', interaction.id);
    this.mockInteractions.set(interaction.id, interaction);
    return this;
  }

  addPactInteraction(rawInteraction) {
    const interaction = new Interaction(rawInteraction, false);
    log.debug('Pact Interaction added to Mock Server -', interaction.id);
    this.pactInteractions.set(interaction.id, interaction);
    return this;
  }

  get(url) {
    validateRequestUrl(this._request, url);
    this._request.url = url;
    this._request.method = 'GET';
    return this;
  }

  head(url) {
    validateRequestUrl(this._request, url);
    this._request.url = url;
    this._request.method = 'HEAD';
    return this;
  }

  patch(url) {
    validateRequestUrl(this._request, url);
    this._request.url = url;
    this._request.method = 'PATCH';
    return this;
  }

  post(url) {
    validateRequestUrl(this._request, url);
    this._request.url = url;
    this._request.method = 'POST';
    return this;
  }

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
   *  .expectStatus(200);
   */
  delete(url) {
    validateRequestUrl(this._request, url);
    this._request.url = url;
    this._request.method = 'DELETE';
    return this;
  }

  withQueryParam(key, value) {
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

  withQueryParams(params) {
    if (!helper.isValidObject(params) || Object.keys(params).length === 0) {
      throw new PactumRequestError(`Invalid query parameters object - ${params ? JSON.stringify(params) : params}`);
    }
    if (!this._request.qs) {
      this._request.qs = {};
    }
    Object.assign(this._request.qs, params);
    return this;
  }

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

  withJson(json) {
    if (typeof json !== 'object') {
      throw new PactumRequestError(`Invalid json in request - ${json}`);
    }
    this._request.data = json;
    return this;
  }

  withHeader(key, value) {
    if (!this._request.headers) {
      this._request.headers = {};
    }
    this._request.headers[key] = value;
    return this;
  }

  withHeaders(headers) {
    if (!helper.isValidObject(headers)) {
      throw new PactumRequestError(`Invalid headers in request - ${headers}`);
    }
    if (!this._request.headers) {
      this._request.headers = {};
    }
    Object.assign(this._request.headers, headers);
    return this;
  }

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
   *   .expectStatus(200);
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
   *   .expectStatus(200);
   *
   * @example
   * const form = new pactum.request.FormData();
   * form.append('my_file', fs.readFileSync(path), { contentType: 'application/xml', filename: 'jUnit.xml' });
   * await pactum
   *  .post('https://jsonplaceholder.typicode.com/upload')
   *  .withMultiPartFormData(form)
   *  .expectStatus(200);
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
   * retry request on specific conditions
   * @param {object} options - retry options
   * @param {number} [options.count=3] - maximum number of retries
   * @param {number} [options.delay=1000] - delay between each request in milliseconds
   * @param {function|string} options.strategy - retry strategy function (return true to retry)
   * @example
   * await pactum
   *  .get('/some/url)
   *  .retry({
   *     strategy: (req, res) => res.statusCode !== 200
   *   })
   *  .expectStatus(200);
   */
  retry(options) {
    if (!options) {
      throw new PactumRequestError('Invalid retry options');
    }
    if (!options.strategy) {
      throw new PactumRequestError('Invalid retry strategy');
    }
    if (!options.count) {
      options.count = 3;
    }
    if (!options.delay) {
      options.delay = 1000;
    }
    this._request.retryOptions = options;
    return this;
  }

  /**
   * overrides default log level for current spec
   * @param {('TRACE'|'DEBUG'|'INFO'|'WARN'|'ERROR')} level - log level
   */
  __setLogLevel(level) {
    this.previousLogLevel = log.level;
    log.setLevel(level);
    return this;
  }

  /**
   * overrides default timeout for current request
   * @param {number} timeout - request timeout in milliseconds
   */
  __setRequestTimeout(timeout) {
    if (typeof timeout !== 'number') {
      throw new PactumRequestError(`Invalid timeout provided - ${timeout}`);
    }
    this._request.timeout = timeout;
    return this;
  }

  /**
   * runs specified custom expect handler
   * @param {string|function} handler - name of the custom expect handler or function itself
   * @param {any} data - additional data
   * @example
   * pactum.handler.addExpectHandler('hasAddress', (req, res, data) => {
   *   const json = res.json;
   *   assert.strictEqual(json.type, data);
   * });
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/users/1')
   *  .expect('isUser')
   *  .expect('hasAddress', 'home')
   *  .expect((req, res, data) => { -- assertion code -- });
   */
  expect(handler, data) {
    this._expect.customExpectHandlers.push({ handler, data });
    return this;
  }

  /**
   * expects a status code on the response
   * @param {number} statusCode - expected HTTP stats code
   * @example
   * await pactum
   *  .delete('https://jsonplaceholder.typicode.com/posts/1')
   *  .expectStatus(200);
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
   *  .expectHeader('connection', /\w+/);
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
   *  .expectHeaderContains('content-type', 'application/json');
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
   *  });
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
   *  }]);
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
   *  });
   */
  expectJsonSchema(schema) {
    this._expect.jsonSchema.push(schema);
    return this;
  }

  /**
   * expects the json at path equals to the value
   * @param {string} path - json path
   * @param {any} value - value to be asserted
   * @see https://www.npmjs.com/package/json-query
   * @example
   * await pactum
   *  .get('some-url')
   *  .expectJsonQuery('[0].name', 'Matt')
   *  .expectJsonQuery('[*].name', ['Matt', 'Pet', 'Don']);
   */
  expectJsonQuery(path, value) {
    this._expect.jsonQuery.push({ path, value });
    return this;
  }

  /**
   * expects the json at path to be like the value
   * @param {string} path - json path
   * @param {any} value - value to be asserted
   * @see https://www.npmjs.com/package/json-query
   * @example
   * await pactum
   *  .get('some-url')
   *  .expectJsonQueryLike('[*].name', ['Matt', 'Pet', 'Don']);
   */
  expectJsonQueryLike(path, value) {
    this._expect.jsonQueryLike.push({ path, value });
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
   * returns custom response
   * @param {string|function} handler - return handler (json-query/handler function)
   * @example
   * const id = await pactum
   *  .get('some-url')
   *  .expectStatus(200)
   *  .returns('user.id') // json query
   * // 'id' will be equal to '123' if response is { user: { id: 123 }}
   * 
   * const resp = await pactum
   *  .get('some-url')
   *  .expectStatus(200)
   *  .returns([0].name)
   *  .returns((req, res) => { return res.json[0].id }) // custom function
   * // 'resp' will be an array containing ['name', 'id']
   */
  returns(handler) {
    this._returns.push(handler);
    return this;
  }

  /**
   * executes the test case
   */
  async toss() {
    const tosser = new Tosser(this);
    return tosser.toss();
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

module.exports = Spec;
