const helper = require('../helpers/helper');
const processor = require('../helpers/dataProcessor');
const validator = require('../helpers/interactionValidator');
const config = require('../config');

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
    this.headers = processor.processData(helper.setValueFromMatcher(request.headers));
    if (request.query && typeof request.query === 'object') {
      this.rawQuery = JSON.parse(JSON.stringify(request.query));
      helper.setMatchingRules(this.matchingRules, this.rawQuery, '$.query');
    }
    this.query = processor.processData(helper.setValueFromMatcher(request.query));
    for (const prop in this.query) {
      this.query[prop] = this.query[prop].toString();
    }
    if (request.body && typeof request.body === 'object') {
      this.rawBody = JSON.parse(JSON.stringify(request.body));
      helper.setMatchingRules(this.matchingRules, this.rawBody, '$.body');
    }
    this.body = processor.processData(helper.setValueFromMatcher(request.body));
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
    this.headers = processor.processData(response.headers);
    if (response.body && typeof response.body === 'object') {
      this.rawBody = JSON.parse(JSON.stringify(response.body));
    } else {
      this.rawBody = response.body;
    }
    this.body = processor.processData(helper.setValueFromMatcher(response.body));
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
    processor.processMaps();
    processor.processTemplates();
    this.setDefaults(rawInteraction, mock);
    validator.validateInteraction(rawInteraction, mock);
    const { id, consumer, provider, state, uponReceiving, withRequest, willRespondWith } = rawInteraction;
    this.id = id || helper.getRandomId();
    this.callCount = 0;
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
      const onCall = willRespondWith.onCall;
      if (helper.isValidObject(onCall)) {
        for (const prop in onCall) {
          this.willRespondWith[parseInt(prop)] = new InteractionResponse(onCall[prop]);
        }
      }
    }
  }

  setDefaults(rawInteraction, mock) {
    if (helper.isValidObject(rawInteraction)) {
      const { willRespondWith } = rawInteraction;
      if (mock && helper.isValidObject(willRespondWith) && willRespondWith.onCall) {
        willRespondWith.status = willRespondWith.status ? willRespondWith.status : 404;
        willRespondWith.body = willRespondWith.body ? willRespondWith.body : 'Response Not Found';
      }
    }
  }

}

module.exports = Interaction;