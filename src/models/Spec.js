const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const Tosser = require('./Tosser');
const Expect = require('./expect');
const State = require('./State');
const helper = require('../helpers/helper');
const log = require('../exports/logger').get();
const th = require('../helpers/toss.helper');
const utils = require('../helpers/utils');
const { PactumRequestError } = require('../helpers/errors');
const responseExpect = require('../exports/expect');
const hr = require('../helpers/handler.runner');
const rlc = require('../helpers/reporter.lifeCycle');

class Spec {
  constructor(name, data) {
    this.id = helper.getRandomId();
    this.flow = '';
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
    this.interactions = [];
    this._wait = null;
    hr.spec(name, data, this);
    this._expect.setDefaultResponseExpectations();
  }

  name(value) {
    this._name = value;
    this._expect.name = value;
    return this;
  }

  setState(name, data) {
    this._state.add(name, data);
    return this;
  }

  use(name, data) {
    hr.spec(name, data, this);
    return this;
  }

  useInteraction(interaction, data) {
    this.interactions.push({ interaction, data });
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

  options(url) {
    validateRequestUrl(this._request, url);
    this._request.url = url;
    this._request.method = 'OPTIONS';
    return this;
  }

  trace(url) {
    validateRequestUrl(this._request, url);
    this._request.url = url;
    this._request.method = 'TRACE';
    return this;
  }

  withMethod(method) {
    this._request.method = method;
    return this;
  }

  withPath(url) {
    validateRequestUrl(this._request, url);
    this._request.url = url;
    return this;
  }

  withPathParams(key, value) {
    if (!this._request.pathParams) {
      this._request.pathParams = {};
    }
    if (typeof key === 'string') {
      this._request.pathParams[key] = value;
    } else {
      Object.assign(this._request.pathParams, key);
    }
    return this;
  }

  withQueryParams(key, value) {
    if (!this._request.queryParams) {
      this._request.queryParams = {};
    }
    if (typeof key === 'string') {
      if (!helper.isValidString(key)) {
        throw new PactumRequestError('`key` is required');
      }
      if (value === undefined || value === null) {
        throw new PactumRequestError('`value` is required');
      }
      this._request.queryParams[key] = value;
    } else {
      if (!helper.isValidObject(key) || Object.keys(key).length === 0) {
        throw new PactumRequestError('`params` are required');
      }
      Object.assign(this._request.queryParams, key);
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
      throw new PactumRequestError(
        `Duplicate body in request - ${this._request.data}`
      );
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

  withFile(key, filePath, options) {
    if (typeof filePath === 'object') {
      options = filePath;
      filePath = key;
      key = 'file';
    }
    if (!filePath) {
      filePath = key;
      key = 'file';
    }
    if (!options) {
      options = {};
    }
    options.filename = options.filename
      ? options.filename
      : path.basename(filePath);
    return this.withMultiPartFormData(key, fs.readFileSync(filePath), options);
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

  withFollowRedirects(follow) {
    this._request.followRedirects = follow;
    return this;
  }

  retry(options, delay) {
    if (typeof options === 'undefined') {
      options = { count: 1, delay: 1000 };
    } else if (typeof options === 'number') {
      options = { count: options, delay: delay || 1000 };
    } else {
      if (!options.count) {
        options.count = 3;
      }
      if (!options.delay) {
        options.delay = 1000;
      }
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
    utils.upsertValues(this._expect.headers, {
      key: header,
      value
    });
    return this;
  }

  expectHeaderContains(header, value) {
    utils.upsertValues(this._expect.headerContains, {
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

  expectJsonMatchStrict(value) {
    this._expect.jsonMatchStrict.push(value);
    return this;
  }

  expectJsonMatchStrictAt(path, value) {
    this._expect.jsonMatchStrictQuery.push({ path, value });
    return this;
  }

  expectJsonSnapshot(matchers) {
    this._expect.jsonSnapshot.push(matchers);
    return this;
  }

  expectError(error) {
    this._expect.errors.push(error);
    return this;
  }

  updateSnapshot() {
    this._expect.updateSnapshot = true;
    return this;
  }

  expectResponseTime(value) {
    this._expect.responseTime = value;
    return this;
  }

  returns(handler) {
    if (this._response) {
      return th.getOutput(this, [handler]);
    } else {
      this._returns.push(handler);
    }
    return this;
  }

  stores(name, path) {
    if (this._response) {
      th.storeSpecData(this, [{ name, path }]);
    } else {
      this._stores.push({ name, path });
    }
    return this;
  }

  records(name, path) {
    if (this._response) {
      th.recordSpecData(this, [{ name, path }]);
    } else {
      this._recorders.push({ name, path });
    }
    return this;
  }

  wait(ms) {
    this._wait = ms;
    return this;
  }

  inspect() {
    this._inspect = true;
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
      throw new PactumRequestError(
        `'response()' should be called after resolving 'toss()'`
      );
    }
    return responseExpect(this._response, this);
  }

  end() {
    rlc.afterSpecReport(this);
    return this;
  }
}

function validateRequestUrl(request, url) {
  if (request.url && request.method) {
    throw new PactumRequestError(
      `Duplicate request initiated. Existing request - ${request.method} ${request.url}`
    );
  }
  if (!helper.isValidString(url)) {
    throw new PactumRequestError(`Invalid request url - ${url}`);
  }
}

module.exports = Spec;
