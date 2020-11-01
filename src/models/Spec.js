const FormData = require('form-data');
const Tosser = require('./Tosser');
const Expect = require('./expect');
const State = require('./State');
const helper = require('../helpers/helper');
const log = require('../helpers/logger');
const { PactumRequestError } = require('../helpers/errors');
const responseExpect = require('../exports/expect');
const handler = require('../exports/handler');

class Spec {

  constructor(name, data) {
    this.id = helper.getRandomId();
    this._name = ''; 
    this.status = 'N/A';
    this.failure = '';
    this.recorded = {};
    this._request = {};
    this._response = null;
    this._returns = [];
    this._recorders = [];
    this._stores = [];
    this._expect = new Expect();
    this._state = new State();
    this.previousLogLevel = null;
    this.mockInteractions = [];
    this.pactInteractions = [];
    this.interactions = [];
    this._waitDuration = null;
    this._init(name, data);
  }

  _init(ctx, data) {
    if (ctx && typeof ctx === "object") {
      const test = ctx.test;
      if (test && test.fullTitle) {
        this._name = test.fullTitle();
      }
    } else {
      this._runHandler(ctx, data);
    }
  }

  name(value) {
    this._name = value; 
    return this;
  }

  _runHandler(name, data) {
    if (typeof name !== 'undefined') {
      const fun = handler.getSpecHandler(name);
      fun({ spec: this, data });
    }
  }

  setState(name, data) {
    this._state.add(name, data);
    return this;
  }

  useMockInteraction(interaction, data) {
    this.mockInteractions.push({ interaction, data });
    return this;
  }

  usePactInteraction(interaction, data) {
    this.pactInteractions.push({ interaction, data });
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

  delete(url) {
    validateRequestUrl(this._request, url);
    this._request.url = url;
    this._request.method = 'DELETE';
    return this;
  }

  withQueryParams(key, value) {
    if (!this._request.qs) {
      this._request.qs = {};
    }
    if (typeof key === 'string') {
      if (!helper.isValidString(key)) {
        throw new PactumRequestError('`key` is required');
      }
      if (value === undefined || value === null) {
        throw new PactumRequestError('`value` is required');
      }
      this._request.qs[key] = value;
    } else {
      if (!helper.isValidObject(key) || Object.keys(key).length === 0) {
        throw new PactumRequestError('`params` are required');
      }
      Object.assign(this._request.qs, key);
    }
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

  withHeaders(key, value) {
    if (!this._request.headers) {
      this._request.headers = {};
    }
    if (typeof key === 'string') {
      this._request.headers[key] = value;
    } else {
      if (!helper.isValidObject(key)) {
        throw new PactumRequestError('`headers` are required');
      }
      Object.assign(this._request.headers, key);
    }
    return this;
  }

  withBody(body) {
    if (typeof this._request.data !== 'undefined') {
      throw new PactumRequestError(`Duplicate body in request - ${this._request.data}`);
    }
    this._request.data = body;
    return this;
  }

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

  withCore(options) {
    this._request.core = options;
    return this;
  }

  withAuth(username, password) {
    if (!this._request.core) {
      this._request.core = {};
    }
    this._request.core.auth = `${username}:${password}`;
    return this;
  }

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

  __setLogLevel(level) {
    this.previousLogLevel = log.level;
    log.setLevel(level);
    return this;
  }

  withRequestTimeout(timeout) {
    if (typeof timeout !== 'number') {
      throw new PactumRequestError(`Invalid timeout provided - ${timeout}`);
    }
    this._request.timeout = timeout;
    return this;
  }

  expect(handler, data) {
    this._expect.customExpectHandlers.push({ handler, data });
    return this;
  }

  expectStatus(statusCode) {
    this._expect.statusCode = statusCode;
    return this;
  }

  expectHeader(header, value) {
    this._expect.headers.push({
      key: header,
      value
    });
    return this;
  }

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

  expectJson(json) {
    this._expect.json.push(json);
    return this;
  }

  expectJsonLike(json) {
    this._expect.jsonLike.push(json);
    return this;
  }

  expectJsonSchema(schema) {
    this._expect.jsonSchema.push(schema);
    return this;
  }

  expectJsonSchemaAt(path, value) {
    this._expect.jsonSchemaQuery.push({ path, value });
    return this;
  }

  expectJsonAt(path, value) {
    this._expect.jsonQuery.push({ path, value });
    return this;
  }

  expectJsonLikeAt(path, value) {
    this._expect.jsonQueryLike.push({ path, value });
    return this;
  }

  expectJsonMatch(value) {
    this._expect.jsonMatch.push(value);
    return this;
  }

  expectJsonMatchAt(path, value) {
    this._expect.jsonMatchQuery.push({ path, value });
    return this;
  }

  expectResponseTime(value) {
    this._expect.responseTime = value;
    return this;
  }

  returns(handler) {
    this._returns.push(handler);
    return this;
  }

  stores(name, path) {
    this._stores.push({ name, path });
    return this;
  }

  records(name, path) {
    this._recorders.push({ name, path });
    return this;
  }

  wait(ms) {
    this._waitDuration = ms;
    return this;
  }

  async toss() {
    const tosser = new Tosser(this);
    return tosser.toss();
  }

  then(resolve, reject) {
    this.toss()
      .then(res => resolve(res))
      .catch(err => reject(err));
  }

  response() {
    if (!this._response) {
      throw new PactumRequestError(`'response()' should be called after resolving 'toss()'`);
    }
    return responseExpect(this._response, this._request);
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
