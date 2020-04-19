const helper = require('../helpers/helper');
const config = require('../config');
const { PactumInteractionError } = require('../helpers/errors');

const ALLOWED_REQUEST_METHODS = new Set(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']);

class InteractionRequest {

  constructor(request) {
    this.matchingRules = {};
    this.method = request.method;
    helper.setMatchingRules(this.matchingRules, request.path, '$.path');
    this.path = helper.setValueFromMatcher(request.path);
    if (request.headers && typeof request.headers === 'object') {
      this.rawHeaders = JSON.parse(JSON.stringify(request.headers));
      const rawLowerCaseHeaders = {};
      for (const prop in this.rawHeaders) {
        rawLowerCaseHeaders[prop.toLowerCase()] = this.rawHeaders[prop];
      }
      helper.setMatchingRules(this.matchingRules, rawLowerCaseHeaders, '$.headers');
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
    if (response.fixedDelay) {
      this.delay = new InteractionResponseDelay('FIXED', response.fixedDelay);
    } else if (response.randomDelay) {
      this.delay = new InteractionResponseDelay('RANDOM', response.randomDelay);
    } else {
      this.delay = new InteractionResponseDelay('NONE', null);
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
    } else {
      this.value = 0;
    }
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
    if (!helper.isValidObject(rawInteraction)) {
      throw new PactumInteractionError(`Invalid interaction provided - ${rawInteraction}`);
    }
    const { withRequest, willRespondWith } = rawInteraction;
    if (!mock) {
      this.validateRequiredFieldsPact(rawInteraction);
    }
    this.validateWithRequest(withRequest);
    if (!mock) {
      this.validateInvalidFieldsPact(withRequest, willRespondWith);
    }
    this.validateWillRespondWith(willRespondWith);
  }

  validateRequiredFieldsPact(rawInteraction) {
    const { provider, state, uponReceiving } = rawInteraction;
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

  validateWithRequest(withRequest) {
    if (typeof withRequest !== 'object') {
      throw new PactumInteractionError(`Invalid interaction request provided - ${withRequest}`);
    }
    if (typeof withRequest.method !== 'string' || !withRequest.method) {
      throw new PactumInteractionError(`Invalid interaction request method provided - ${withRequest.method}`);
    }
    if (!ALLOWED_REQUEST_METHODS.has(withRequest.method)) {
      throw new PactumInteractionError(`Invalid interaction request method provided - ${withRequest.method}`);
    }
    if (withRequest.path === undefined || withRequest.path === null) {
      throw new PactumInteractionError(`Invalid interaction request path provided - ${withRequest.path}`);
    }
  }

  validateInvalidFieldsPact(withRequest, willRespondWith) {
    if (withRequest.ignoreQuery) {
      throw new PactumInteractionError(`Pact interaction won't support ignore query`);
    }
    if (withRequest.ignoreBody) {
      throw new PactumInteractionError(`Pact interaction won't support ignore body`);
    }
    if (willRespondWith.fixedDelay) {
      throw new PactumInteractionError(`Pact interaction won't support delays`);
    }
    if (willRespondWith.randomDelay) {
      throw new PactumInteractionError(`Pact interaction won't support delays`);
    }
  }

  validateWillRespondWith(willRespondWith) {
    if (helper.isValidObject(willRespondWith)) {
      if (typeof willRespondWith.status !== 'number') {
        throw new PactumInteractionError(`Invalid interaction response status provided - ${willRespondWith.status}`);
      }
      if (willRespondWith.fixedDelay) {
        this.validateFixedDelay(willRespondWith.fixedDelay);
      }
      if (willRespondWith.randomDelay) {
        this.validateRandomDelay(willRespondWith.randomDelay);
      }
    } else {
      if (typeof willRespondWith !== 'function') {
        throw new PactumInteractionError(`Invalid interaction response provided - ${willRespondWith}`);
      }
    }
  }

  validateFixedDelay(fixedDelay) {
    if (typeof fixedDelay !== 'number') {
      throw new PactumInteractionError(`Invalid interaction response Fixed Delay provided - ${fixedDelay}`);
    }
    if (fixedDelay < 0) {
      throw new PactumInteractionError(`Interaction response Fixed Delay should be greater than 0`);
    }
  }

  validateRandomDelay(randomDelay) {
    if (!helper.isValidObject(randomDelay)) {
      throw new PactumInteractionError(`Invalid Random Delay provided- ${randomDelay}`);
    }
    if (typeof randomDelay.min !== 'number') {
      throw new PactumInteractionError(`Invalid min value provided in Random Delay - ${randomDelay.min}`);
    }
    if (typeof randomDelay.max !== 'number') {
      throw new PactumInteractionError(`Invalid max value provided in Random Delay - ${randomDelay.max}`);
    }
    if (randomDelay.min < 0) {
      throw new PactumInteractionError(`Min value in Random Delay should be greater than 0`);
    }
    if (randomDelay.max < 0) {
      throw new PactumInteractionError(`Max value in Random Delay should be greater than 0`);
    }
    if (randomDelay.min > randomDelay.max) {
      throw new PactumInteractionError(`Min value in Random Delay should be less than Max Value`);
    }
  }

}

module.exports = Interaction;