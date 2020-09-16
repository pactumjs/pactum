const FormData = require('form-data');
const Tosser = require('./Tosser');
const Expect = require('./expect');
const State = require('./State');
const Interaction = require('./interaction');
const helper = require('../helpers/helper');
const log = require('../helpers/logger');
const { PactumRequestError } = require('../helpers/errors');
const mock = require('../exports/mock');
const responseExpect = require('../exports/expect');
const handler = require('../exports/handler');

class Spec {

  constructor() {
    this.id = helper.getRandomId();
    this._request = {};
    this._response = null;
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

  useInteraction(basicInteraction, data) {
    if (typeof basicInteraction === 'string') {
      basicInteraction = handler.getInteractionHandler(basicInteraction)({ data });
    }
    const rawInteraction = {
      withRequest: helper.getRequestFromBasicInteraction(basicInteraction),
      willRespondWith: {
        status: basicInteraction.status || 200,
        body: basicInteraction.return || ''
      }
    };
    return this.useMockInteraction(rawInteraction);
  }

  useMockInteraction(rawInteraction, data) {
    if (typeof rawInteraction === 'string') {
      rawInteraction = handler.getMockInteractionHandler(rawInteraction)({ data });
    }
    const interaction = new Interaction(rawInteraction, true);
    log.debug('Mock Interaction added to Mock Server -', interaction.id);
    this.mockInteractions.set(interaction.id, interaction);
    return this;
  }

  usePactInteraction(rawInteraction, data) {
    if (typeof rawInteraction === 'string') {
      rawInteraction = handler.getPactInteractionHandler(rawInteraction)({ data });
    }
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

  del(url) {
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

  expectJsonQuery(path, value) {
    this._expect.jsonQuery.push({ path, value });
    return this;
  }

  expectJsonQueryLike(path, value) {
    this._expect.jsonQueryLike.push({ path, value });
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
