const fs = require('fs');
const lc = require('lightcookie');
const override = require('deep-override');
const path = require('path');
const Tosser = require('./Tosser');
const Expect = require('./expect');
const State = require('./State');
const helper = require('../helpers/helper');
const log = require('../plugins/logger');
const th = require('../helpers/toss.helper');
const utils = require('../helpers/utils');
const { PactumRequestError } = require('../helpers/errors');
const responseExpect = require('../exports/expect');
const hr = require('../helpers/handler.runner');
const rlc = require('../helpers/reporter.lifeCycle');
const config = require('../config');
const { findFile } = require('../exports/utils');
const stash = require('../exports/stash');
const { memorize_spec, is_spec_memoized } = require('../helpers/memo');

class Spec {
  constructor(name, data, opts) {
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
    this._save = null;
    this._data_maps = [];
    this._specHandlerData = data;
    this._sleep = '';
    hr.spec(name, data, this);
    this._opts = opts || {};
    this._opts.handler_name = name;
    this._expect.setDefaultResponseExpectations();
  }

  sleep(ms) {
    this._sleep = ms;
    return this;
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
    this._specHandlerData = data;
    hr.spec(name, data, this);
    return this;
  }

  useInteraction(interaction, data) {
    if (config.request.disable_use_interaction) {
      return this;
    }
    this.interactions.push({ interaction, data });
    return this;
  }

  useDataMap(key, value) {
    this._data_maps.push({ key, value });
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
      if (Object.keys(this._request.queryParams).includes(key)) {
        if (!Array.isArray(this._request.queryParams[key])) {
          this._request.queryParams[key] = [this._request.queryParams[key]];
        }
        this._request.queryParams[key].push(value);
      } else {
        this._request.queryParams[key] = value;
      }
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
    if (typeof json === 'string') {
      json = getJsonFromTemplateOrFile(json);
    } else if (typeof json !== 'object') {
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

  withCookies(key, value) {
    if (!this._request.headers) {
      this._request.headers = {};
    }
    let cookie;
    if (typeof key === 'object') {
      cookie = lc.serialize(key);
    } else {
      if (value) {
        cookie = `${key}=${value}`;
      } else {
        cookie = key;
      }
    }
    const headers = this._request.headers;
    if (headers['cookie'] !== undefined) {
      headers['cookie'] = headers['cookie'] + ';' + cookie;
    } else {
      headers['cookie'] = cookie;
    }
    return this;
  }

  withBody(body) {
    if (typeof body === 'object' && body && body.file) {
      this._request.data = fs.readFileSync(body.file)
    } else {
      this._request.data = body;
    }
    return this;
  }

  withForm(key, value) {
    if (!this._request._forms) this._request._forms = [];
    this._request._forms.push({ key, value });
    return this;
  }

  withMultiPartFormData(key, value, options) {
    if (!this._request._multi_parts) this._request._multi_parts = [];
    this._request._multi_parts.push({ key, value, options });
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
    this._request.core = this._request.core || {};
    override(this._request.core, options);
    return this;
  }

  withAuth(username, password) {
    if (!this._request.core) {
      this._request.core = {};
    }
    this._request.core.auth = `${username}:${password}`;
    return this;
  }

  withBearerToken(token) {
    if (typeof token !== 'string') {
      throw new PactumRequestError('`token` is required');
    }
    if (!this._request.headers) {
      this._request.headers = {};
    }
    this._request.headers["Authorization"] = "Bearer " + token;
    return this;
  }

  withFollowRedirects(follow) {
    if (typeof follow !== 'number' && typeof follow !== 'boolean') {
      throw new PactumRequestError('Follow redirects should be number or boolean');
    }
    if (typeof follow == 'number' && follow >=0 ) {
      this._request.followRedirects = follow;
      return this;
    }
    this._request.followRedirects = follow;
    return this;
  }

  withCompression() {
    this._request.compression = true;
    return this;
  }

  retry(options, delay) {
    if (typeof options === 'undefined' || typeof options === 'number') {
      options = { count: options, delay: delay };
    }
    this._request.retryOptions = options;
    return this;
  }

  useLogLevel(level) {
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

  expectStatus(statusCode, message = '') {
    this._expect.statusCode = statusCode;
    this._expect.customMessage = message;
    return this;
  }

  expectHeader(header, value) {
    utils.upsertValues(this._expect.headers, {
      key: header,
      value,
    });
    return this;
  }

  expectHeaderContains(header, value) {
    utils.upsertValues(this._expect.headerContains, {
      key: header,
      value,
    });
    return this;
  }

  expectCookies(key, value) {
    this._expect.cookies.push(utils.createCookieObject(key, value));
    return this;
  }

  expectCookiesLike(key, value) {
    this._expect.cookiesLike.push(utils.createCookieObject(key, value));
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

  expectJson(path, value) {
    typeof value === 'undefined' ? this._expect.json.push(getJsonFromTemplateOrFile(path)) : this._expect.jsonQuery.push({ path, value });
    return this;
  }
  expectJsonAt(...args) { return this.expectJson(...args); }

  expectJsonLike(path, value) {
    typeof value === 'undefined' ? this._expect.jsonLike.push(getJsonFromTemplateOrFile(path)) : this._expect.jsonQueryLike.push({ path, value });
    return this;
  }
  expectJsonLikeAt(...args) { return this.expectJsonLike(...args); }

  expectJsonSchema(path, value, options) {
    if (typeof options === 'object') {
      this._expect.jsonSchemaQuery.push({ path, value, options });
    } else {
      if (typeof value === 'undefined') {
        this._expect.jsonSchema.push({ value: getJsonFromTemplateOrFile(path) });
      } else {
        if (typeof path === 'object' && typeof value === 'object') {
          this._expect.jsonSchema.push({ value: path, options: value });
        } else {
          this._expect.jsonSchemaQuery.push({ path, value });
        }
      }
    }
    return this;
  }
  expectJsonSchemaAt(...args) { return this.expectJsonSchema(...args); }

  expectJsonMatch(path, value) {
    typeof value === 'undefined' ? this._expect.jsonMatch.push(getJsonFromTemplateOrFile(path)) : this._expect.jsonMatchQuery.push({ path, value });
    return this;
  }
  expectJsonMatchAt(...args) { return this.expectJsonMatch(...args); }

  expectJsonMatchStrict(path, value) {
    typeof value === 'undefined' ? this._expect.jsonMatchStrict.push(getJsonFromTemplateOrFile(path)) : this._expect.jsonMatchStrictQuery.push({ path, value });
    return this;
  }
  expectJsonMatchStrictAt(...args) { return this.expectJsonMatchStrict(...args); }

  expectJsonSnapshot(name, value) {
    typeof name === 'string' ? this._expect.jsonSnapshots.push({ name, value }) : this._expect.jsonSnapshots.push({ value: name });
    return this;
  }

  expectJsonLength(path, value) {
    typeof value === 'undefined' ? this._expect.jsonLength.push(path) : this._expect.jsonLengthQuery.push({ path, value });
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

  stores(...args) {
    if (args.length === 0) {
      return this;
    }

    /**
     * @type {import('../internal.types').ISpecStore}
     */
    const spec_store = {};

    if (typeof args[0] === 'function') {
      spec_store.cb = args[0];
    } else {
      spec_store.name = args[0];
      spec_store.path = args[1];
      spec_store.options = args[2];
    }

    if (this._response) {
      th.storeSpecData(this, [spec_store]);
    } else {
      this._stores.push(spec_store);
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

  wait(arg1, arg2) {
    this._wait = { arg1, arg2 };
    return this;
  }

  inspect(inspect_path) {
    if (typeof inspect_path === 'string') {
      if (!Array.isArray(this._inspect)) {
        this._inspect = [];
      }
      this._inspect.push(inspect_path);
    } else if (typeof inspect_path === 'boolean') {
      this._inspect = inspect_path;
    } else {
      this._inspect = true;
    }
    return this;
  }

  save(path) {
    this._save = path;
    return this;
  }

  async toss() {
    if (this._opts.handler_name && typeof this._opts.memo !== 'undefined') {
      if (is_spec_memoized(this._opts.handler_name, this._opts.memo)) {
        return Promise.resolve();
      }
      memorize_spec(this._opts.handler_name, this._opts.memo);
    }
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

function getJsonFromTemplateOrFile(path) {
  if (typeof path === 'string') {
    if (stash.getDataTemplate()[path]) {
      return { '@DATA:TEMPLATE@': path };
    } else {
      return JSON.parse(findFile(path));
    }
  }
  return path;
}

module.exports = Spec;
