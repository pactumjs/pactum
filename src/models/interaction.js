const helper = require('../helpers/helper');
const config = require('../config');
const { PactumInteractionError } = require('../helpers/errors');

class InteractionRequest {

  constructor(request) {
    this.method = request.method;
    this.path = request.path;
    this.headers = request.headers;
    this.query = request.query;
    this.body = request.body;
    this.ignoreBody = false;
    this.ignoreQuery = false;
    if (typeof request.ignoreBody === 'boolean') {
      this.ignoreBody = request.ignoreBody;
    }
    if (typeof request.ignoreQuery === 'boolean') {
      this.ignoreQuery = request.ignoreQuery;
    }
  }

}

class InteractionResponse {

  constructor(response) {
    this.status = response.status;
    this.headers = response.headers;
    this.rawBody = JSON.parse(JSON.stringify(response.body)); 
    this.body = helper.setValueFromMatcher(response.body);
  }

}

class Interaction {

  constructor(rawInteraction, mock = false) {
    this.validateInteraction(rawInteraction, mock);
    const { port, consumer, provider, state, uponReceiving, withRequest, willRespondWith } = rawInteraction;
    this.id = helper.getRandomId();
    this.port = port || config.mock.port;
    this.mock = mock;
    this.consumer = consumer;
    this.provider = provider;
    this.state = state;
    this.uponReceiving = uponReceiving;
    this.rawInteraction = rawInteraction;
    this.withRequest = new InteractionRequest(withRequest);
    this.willRespondWith = new InteractionResponse(willRespondWith);
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
    if (typeof withRequest.path !== 'string' || !withRequest.path) {
      throw new PactumInteractionError(`Invalid interaction request path provided - ${withRequest.path}`);
    }
    if (typeof willRespondWith !== 'object') {
      throw new PactumInteractionError(`Invalid interaction request provided - ${willRespondWith}`);
    }
    if (typeof willRespondWith.status !== 'number') {
      throw new PactumInteractionError(`Invalid interaction response status provided - ${willRespondWith.status}`);
    }
  }

}

module.exports = Interaction;