const FormData = require('form-data');
const Tosser = require('./Tosser');
const Expect = require('./expect');
const helper = require('../helpers/helper');
const log = require('../helpers/logger');
const { PactumRequestError } = require('../helpers/errors');
const config = require('../config');

class Spec {

  constructor() {
    this.id = helper.getRandomId();
    this._request = {};
    this._response = {};
    this._expect = new Expect();
    this.previousLogLevel = null;
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
   * adds query params to the request url - /comments?postId=1
   * @param {object} params - query params
   * @example
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/comments')
   *  .withQueryParams({ 'postId': '1' })
   *  .expectStatus(200)
   *  .toss();
   * @summary generated url will look like - /comments?postId=1&userId=2
   */
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
   * appends header to the request
   * @param {string} key - header key
   * @param {string} value - header value
   * @example
   * await pactum
   *  .post('')
   *  .withHeader('Authorization', 'Basic xxx')
   *  .withHeader('Accept', 'json')
   *  .expectStatus(200)
   */
  withHeader(key, value) {
    if (!this._request.headers) {
      this._request.headers = {};
    }
    this._request.headers[key] = value;
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
    if (!this._request.headers) {
      this._request.headers = {};
    }
    Object.assign(this._request.headers, headers);
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
   * retry request on specific conditions
   * @param {object} options - retry options
   * @param {number} [options.count=3] - maximum number of retries
   * @param {number} [options.delay=1000] - delay between each request in milliseconds
   * @param {function|string} options.strategy - retry strategy function (return true to retry)
   * @example
   * await pactum
   *  .get('/some/url)
   *  .retry({
   *     strategy: (res) => res.statusCode !== 200
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
   * pactum.handler.addExpectHandler('hasAddress', (response, data) => {
   *   const json = response.json;
   *   assert.strictEqual(json.type, data);
   * });
   * await pactum
   *  .get('https://jsonplaceholder.typicode.com/users/1')
   *  .expect('isUser')
   *  .expect('hasAddress', 'home')
   *  .expect((res, data) => { -- assertion code -- });
   */
  expect(handler, data) {
    this._expect.customExpectHandlers.push({handler, data});
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
   * executes the test case
   */
  async toss() {
    const tosser = new Tosser({
      request: this._request,
      expect: this._expect,
      previousLogLevel: this.previousLogLevel
    });
    tosser.updateRequest();
    await tosser.setResponse();
    tosser.setPreviousLogLevel();
    tosser.validateError();
    tosser.validateResponse();
    return tosser.response;
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
