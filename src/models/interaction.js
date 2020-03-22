const helper = require('../helpers/helper');
const config = require('../config');
const { PactumInteractionError } = require('../helpers/errors');

const ALLOWED_REQUEST_METHODS = new Set(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']);

class InteractionRequest {

  constructor(request) {
    this.method = request.method;
    this.path = request.path;
    this.matchingRules = {};
    if (request.headers && typeof request.headers === 'object') {
      this.rawHeaders = JSON.parse(JSON.stringify(request.headers));
      helper.setMatchingRules(this.matchingRules, this.rawHeaders, '$.headers');
    }
    this.headers = helper.setValueFromMatcher(request.headers);
    if (request.query && typeof request.query === 'object') {
      this.rawQuery = JSON.parse(JSON.stringify(request.query));
      helper.setMatchingRules(this.matchingRules, this.rawQuery, '$.query');
    }
    this.query = helper.setValueFromMatcher(request.query);
    for (const prop in this.query) {
      this.query[prop] = this.query[prop].toString();
    }
    if (request.body && typeof request.body === 'object') {
      this.rawBody = JSON.parse(JSON.stringify(request.body));
      helper.setMatchingRules(this.matchingRules, this.rawBody, '$.body');
    }
    this.body = helper.setValueFromMatcher(request.body);
    this.ignoreBody = false;
    this.ignoreQuery = false;
    if (typeof request.ignoreBody === 'boolean') {
      this.ignoreBody = request.ignoreBody;
    }
    if (typeof request.ignoreQuery === 'boolean') {
      this.ignoreQuery = request.ignoreQuery;
    }
    if (request.graphQL) {
      this.graphQL = new InteractionRequestGraphQL(request.graphQL);
      this.body = {
        query: request.graphQL.query,
        variables:  request.graphQL.variables
      };
    }
  }

}

class InteractionRequestGraphQL {

  constructor(graphQL) {
    this.query = graphQL.query;
    this.variables = graphQL.variables;
  }

}

class InteractionResponse {

  constructor(response) {
    this.status = response.status;
    this.headers = response.headers;
    if (response.body && typeof response.body === 'object') {
      this.rawBody = JSON.parse(JSON.stringify(response.body));
    } else {
      this.rawBody = response.body;
    }
    this.body = helper.setValueFromMatcher(response.body);
  }

}

class Interaction {

  constructor(rawInteraction, mock = false) {
    this.validateInteraction(rawInteraction, mock);
    const { id, consumer, provider, state, uponReceiving, withRequest, willRespondWith } = rawInteraction;
    this.id = id || helper.getRandomId();
    this.mock = mock;
    this.consumer = consumer || config.pact.consumer;
    this.provider = provider;
    this.state = state;
    this.uponReceiving = uponReceiving;
    this.rawInteraction = rawInteraction;
    this.withRequest = new InteractionRequest(withRequest);
    if (typeof willRespondWith === 'function') {
      this.willRespondWith = willRespondWith;
    } else {
      this.willRespondWith = new InteractionResponse(willRespondWith);
    }
  }

  validateInteraction(rawInteraction, mock) {
    if (typeof rawInteraction !== 'object') {
      throw new PactumInteractionError(`Invalid interaction provided`);
    }
    const { provider, state, uponReceiving, withRequest, willRespondWith } = rawInteraction;
    if (!mock) {
      if (typeof provider !== 'string' || !provider) {
        throw new PactumInteractionError(`Invalid provider name provided - ${provider}`);
      }
      if (typeof state !== 'string' || !state) {
        throw new PactumInteractionError(`Invalid state provided - ${state}`);
      }
      if (typeof uponReceiving !== 'string' || !uponReceiving) {
        throw new PactumInteractionError(`Invalid upon receiving description provided - ${uponReceiving}`);
      }
    }
    if (typeof withRequest !== 'object') {
      throw new PactumInteractionError(`Invalid interaction request provided - ${withRequest}`);
    }
    if (typeof withRequest.method !== 'string' || !withRequest.method) {
      throw new PactumInteractionError(`Invalid interaction request method provided - ${withRequest.method}`);
    }
    if (!ALLOWED_REQUEST_METHODS.has(withRequest.method)) {
      throw new PactumInteractionError(`Invalid interaction request method provided - ${withRequest.method}`);
    }
    if (typeof withRequest.path !== 'string' || !withRequest.path) {
      throw new PactumInteractionError(`Invalid interaction request path provided - ${withRequest.path}`);
    }
    if (!mock) {
      if (withRequest.ignoreQuery) {
        throw new PactumInteractionError(`Pact interaction won't support ignore query`);
      }
      if (withRequest.ignoreBody) {
        throw new PactumInteractionError(`Pact interaction won't support ignore body`);
      }
    }
    if (typeof willRespondWith === 'object') {
      if (typeof willRespondWith.status !== 'number') {
        throw new PactumInteractionError(`Invalid interaction response status provided - ${willRespondWith.status}`);
      }
    } else {
      if (typeof willRespondWith !== 'function') {
        throw new PactumInteractionError(`Invalid interaction request provided - ${willRespondWith}`);
      }
    }
  }

}

module.exports = Interaction;