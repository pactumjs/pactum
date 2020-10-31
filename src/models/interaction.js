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
      const rawLowerCaseHeaders = {};
      for (const prop in request.headers) {
        rawLowerCaseHeaders[prop.toLowerCase()] = request.headers[prop];
      }
      helper.setMatchingRules(this.matchingRules, rawLowerCaseHeaders, '$.headers');
    }
    this.headers = helper.setValueFromMatcher(request.headers);
    if (request.query && typeof request.query === 'object') {
      helper.setMatchingRules(this.matchingRules, request.query, '$.query');
    }
    this.query = helper.setValueFromMatcher(request.query);
    for (const prop in this.query) {
      this.query[prop] = this.query[prop].toString();
    }
    if (request.body && typeof request.body === 'object') {
      // this.rawBody = JSON.parse(JSON.stringify(request.body));
      helper.setMatchingRules(this.matchingRules, request.body, '$.body');
    }
    this.body = helper.setValueFromMatcher(request.body);
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
    this.matchingRules = {};
    this.status = response.status;
    helper.setMatchingRules(this.matchingRules, response.headers, '$.headers');
    this.headers = helper.setValueFromMatcher(response.headers);
    helper.setMatchingRules(this.matchingRules, response.body, '$.body');
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

class InteractionExpectations {
  
  constructor(expects) {
    this.exercised = expects.exercised;
    this.callCount = expects.callCount;
  }

}

class Interaction {

  constructor(raw, mock = false) {
    processor.processMaps();
    processor.processTemplates();
    raw = processor.processData(raw);
    this.setDefaults(raw, mock);
    validator.validateInteraction(raw, mock);
    const { id, consumer, provider, state, uponReceiving, withRequest, willRespondWith, expects } = raw;
    this.id = id || helper.getRandomId();
    this.callCount = 0;
    this.mock = mock;
    this.consumer = consumer || config.pact.consumer;
    this.provider = provider;
    this.state = state;
    this.uponReceiving = uponReceiving;
    this.rawInteraction = raw;
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
    this.expects = new InteractionExpectations(expects);
  }

  setDefaults(raw, mock) {
    if (helper.isValidObject(raw)) {
      if (mock) {
        if (!raw.willRespondWith) {
          raw.willRespondWith = {};
        }
        const { willRespondWith } = raw;
        if (helper.isValidObject(willRespondWith)) {
          if (typeof willRespondWith.status === 'undefined') willRespondWith.status = 404;
        }
      }
      if (!raw.expects) {
        raw.expects = { exercised: true };
      }
      if (typeof raw.expects.exercised === 'undefined') {
        raw.expects.exercised = true;
      }
    }
  }

}

module.exports = Interaction;