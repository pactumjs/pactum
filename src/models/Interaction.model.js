const { setMatchingRules, getValue } = require('pactum-matchers').utils;
const processor = require('../helpers/dataProcessor');
const helper = require('../helpers/helper');
const { PactumInteractionError } = require('../helpers/errors');
const { klona: clone } = require('klona');
const ALLOWED_REQUEST_METHODS = new Set([
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'HEAD',
  'OPTIONS',
  'TRACE',
]);

function process(raw) {
  processor.processMaps();
  processor.processTemplates();
  return processor.processData(raw);
}

function setRawDefaults(raw) {
  if (helper.isValidObject(raw)) {
    if (typeof raw.strict === 'undefined') {
      raw.strict = true;
    }
    if (!raw.response) {
      raw.response = {};
    }
    if (helper.isValidObject(raw.response)) {
      if (typeof raw.response.status === 'undefined') raw.response.status = 404;
    }
    if (!raw.expects) {
      raw.expects = { disable: false, exercised: true };
    }
    if (typeof raw.expects.exercised === 'undefined') {
      raw.expects.exercised = true;
    }
    if (typeof raw.expects.disable === 'undefined') {
      raw.expects.disable = false;
    }
    if (raw.expects.disable) {
      raw.expects.exercised = false;
    }
  }
}

function validate(raw) {
  if (!helper.isValidObject(raw)) {
    throw new PactumInteractionError('`interaction` is required');
  }
  const { request, response } = raw;
  if (!request) {
    throw new PactumInteractionError('`request` is required');
  }
  if (typeof request.method !== 'string' || !request.method) {
    throw new PactumInteractionError('`request.method` is required');
  }
  if (!ALLOWED_REQUEST_METHODS.has(request.method)) {
    throw new PactumInteractionError('`request.method` is invalid');
  }
  if (request.path === undefined || request.path === null) {
    throw new PactumInteractionError('`request.path` is required');
  }
  if (typeof request.queryParams !== 'undefined') {
    if (!helper.isValidObject(request.queryParams)) {
      throw new PactumInteractionError(
        '`request.queryParams` should be object'
      );
    }
  }
  if (helper.isValidObject(response)) {
    if (typeof response.status !== 'number') {
      throw new PactumInteractionError('`response.status` is required');
    }
  } else {
    if (typeof response !== 'function') {
      throw new PactumInteractionError('`response` is required');
    }
  }
}

function setResponse(response) {
  if (typeof response === 'function') {
    return response;
  }
  const res = new InteractionResponse(response);
  const onCall = response.onCall;
  if (helper.isValidObject(onCall)) {
    for (const prop in onCall) {
      res[parseInt(prop)] = new InteractionResponse(onCall[prop]);
    }
  }
  return res;
}

class InteractionRequestGraphQL {
  constructor(graphQL) {
    this.query = graphQL.query;
    this.variables = graphQL.variables;
  }
}

class InteractionRequest {
  constructor(request) {
    this.matchingRules = {};
    this.method = request.method;
    this.path = request.path;
    if (request.pathParams) {
      setMatchingRules(this.matchingRules, request.pathParams, '$.path');
      this.pathParams = getValue(request.pathParams);
    }
    if (request.headers && typeof request.headers === 'object') {
      const rawLowerCaseHeaders = {};
      for (const prop in request.headers) {
        rawLowerCaseHeaders[prop.toLowerCase()] = request.headers[prop];
      }
      setMatchingRules(this.matchingRules, rawLowerCaseHeaders, '$.headers');
      this.headers = getValue(request.headers);
    }
    if (request.queryParams && typeof request.queryParams === 'object') {
      setMatchingRules(this.matchingRules, request.queryParams, '$.query');
      this.queryParams = getValue(request.queryParams);
      for (const prop in this.queryParams) {
        this.queryParams[prop] = this.queryParams[prop].toString();
      }
    } else {
      this.queryParams = {};
    }
    if (typeof request.body !== 'undefined') {
      if (typeof request.body === 'object') {
        setMatchingRules(this.matchingRules, request.body, '$.body');
      }
      this.body = getValue(request.body);
    }
    if (request.graphQL) {
      this.graphQL = new InteractionRequestGraphQL(request.graphQL);
      if (this.method === 'GET') {
        this.queryParams.query = request.graphQL.query;
        if (request.graphQL.variables) this.queryParams.variables = request.graphQL.variables;
      } else {
        this.body = {
          query: request.graphQL.query,
          variables: request.graphQL.variables
        };
      }
    }
    if (request.form) {
      setMatchingRules(this.matchingRules, request.form, '$.body');
      this.form = getValue(request.form);
    }
  }
}

class InteractionResponse {
  constructor(response) {
    this.matchingRules = {};
    this.status = response.status;
    setMatchingRules(this.matchingRules, response.headers, '$.headers');
    this.headers = getValue(response.headers);
    setMatchingRules(this.matchingRules, response.body, '$.body');
    this.body = getValue(response.body);
    if (response.fixedDelay) {
      this.delay = new InteractionResponseDelay('FIXED', response.fixedDelay);
    } else if (response.randomDelay) {
      this.delay = new InteractionResponseDelay('RANDOM', response.randomDelay);
    }
    if (response.file) {
      this.file = getValue(response.file);
    }
  }
}

class InteractionResponseDelay {
  constructor(type, props) {
    this.type = type;
    if (type === 'RANDOM') {
      this.subType = 'UNIFORM';
      this.min = props.min;
      this.max = props.max;
    } else if (type === 'FIXED') {
      this.value = props;
    }
  }
}

class InteractionExpectations {
  constructor(expects) {
    this.disable = expects.disable;
    this.exercised = expects.exercised;
    this.callCount = expects.callCount;
  }
}

class Interaction {
  constructor(raw) {
    let unprocessedResponse;
    if (raw && raw.clone) {
      raw = clone(raw);
    }
    if (raw && raw.response) {
      unprocessedResponse = raw.response;
      delete raw.response;
    }
    raw = process(raw);
    if (raw && unprocessedResponse) {
      raw.response = unprocessedResponse;
    }
    setRawDefaults(raw);
    validate(raw);
    this.callCount = 0;
    this.exercised = false;
    this.calls = [];
    const {
      id,
      provider,
      flow,
      strict,
      background,
      request,
      response,
      expects,
      stores
    } = raw;
    this.id = id || helper.getRandomId();
    if (flow) this.flow = flow;
    if (provider) this.provider = provider;
    if (background) this.background = background;
    this.strict = strict;
    this.request = new InteractionRequest(request);
    this.response = setResponse(response);
    this.expects = new InteractionExpectations(expects);
    if (stores && typeof stores === 'object') {
      this.stores = stores;
    }
  }
}

module.exports = Interaction;
