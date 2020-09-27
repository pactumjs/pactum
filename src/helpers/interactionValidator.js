const helper = require('./helper');
const { PactumInteractionError} = require('./errors');
const config = require('../config');

const ALLOWED_REQUEST_METHODS = new Set(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']);

const validator = {

  validateInteraction(rawInteraction, mock) {
    if (!helper.isValidObject(rawInteraction)) {
      throw new PactumInteractionError('`interaction` is required');
    }
    const { withRequest, willRespondWith } = rawInteraction;
    if (!mock) {
      this.validateRequiredFieldsPact(rawInteraction);
    }
    this.validateWithRequest(withRequest);
    if (!mock) {
      this.validateInvalidFieldsPact(withRequest, willRespondWith);
    }
    this.validateWillRespondWith(willRespondWith, mock);
  },

  validateRequiredFieldsPact(rawInteraction) {
    const { provider, state, uponReceiving, consumer } = rawInteraction;
    if (typeof provider !== 'string' || !provider) {
      throw new PactumInteractionError('`provider` is required');
    }
    if (typeof state !== 'string' || !state) {
      throw new PactumInteractionError('`state` is required');
    }
    if (typeof uponReceiving !== 'string' || !uponReceiving) {
      throw new PactumInteractionError('`uponReceiving` is required');
    }
    if (!consumer && !config.pact.consumer) {
      throw new PactumInteractionError('`consumer` is required => Add consumer through `pactum.consumer.setConsumerName()`');
    }
  },

  validateWithRequest(withRequest) {
    if (typeof withRequest !== 'object') {
      throw new PactumInteractionError('`withRequest` is required');
    }
    if (typeof withRequest.method !== 'string' || !withRequest.method) {
      throw new PactumInteractionError('`withRequest.method` is required');
    }
    if (!ALLOWED_REQUEST_METHODS.has(withRequest.method)) {
      throw new PactumInteractionError('`withRequest.method` is invalid');
    }
    if (withRequest.path === undefined || withRequest.path === null) {
      throw new PactumInteractionError('`withRequest.path` is required');
    }
    if (typeof withRequest.query !== 'undefined') {
      if (!withRequest.query || typeof withRequest.query !== 'object' || Array.isArray(withRequest.query)) {
        throw new PactumInteractionError('`withRequest.query` should be object');
      }
    }
  },

  validateInvalidFieldsPact(withRequest, willRespondWith) {
    if (typeof willRespondWith === 'function') {
      throw new PactumInteractionError(`Pact interaction won't support function response`);
    }
    if (willRespondWith.fixedDelay) {
      throw new PactumInteractionError(`Pact interaction won't support delays`);
    }
    if (willRespondWith.randomDelay) {
      throw new PactumInteractionError(`Pact interaction won't support delays`);
    }
    if (willRespondWith.onCall) {
      throw new PactumInteractionError(`Pact interaction won't support consecutive call responses`);
    }
  },

  validateWillRespondWith(willRespondWith) {
    if (helper.isValidObject(willRespondWith)) {
      if (typeof willRespondWith.status !== 'number') {
        throw new PactumInteractionError('`willRespondWith.status` is required');
      }
      if (willRespondWith.fixedDelay) {
        this.validateFixedDelay(willRespondWith.fixedDelay);
      }
      if (willRespondWith.randomDelay) {
        this.validateRandomDelay(willRespondWith.randomDelay);
      }
      this.validateOnCall(willRespondWith.onCall);
    } else {
      if (typeof willRespondWith !== 'function') {
        throw new PactumInteractionError('`willRespondWith` is required');
      }
    }
  },

  validateFixedDelay(fixedDelay) {
    if (typeof fixedDelay !== 'number') {
      throw new PactumInteractionError('`willRespondWith.fixedDelay` should be number');
    }
    if (fixedDelay < 0) {
      throw new PactumInteractionError('`willRespondWith.fixedDelay` should be greater than 0');
    }
  },

  validateRandomDelay(randomDelay) {
    if (!helper.isValidObject(randomDelay)) {
      throw new PactumInteractionError('`willRespondWith.randomDelay` should be object');
    }
    if (typeof randomDelay.min !== 'number') {
      throw new PactumInteractionError('`willRespondWith.randomDelay.min` should be number');
    }
    if (typeof randomDelay.max !== 'number') {
      throw new PactumInteractionError('`willRespondWith.randomDelay.max` should be number');
    }
    if (randomDelay.min < 0) {
      throw new PactumInteractionError('`willRespondWith.randomDelay.min` should be greater than 0');
    }
    if (randomDelay.max < 0) {
      throw new PactumInteractionError('`willRespondWith.randomDelay.max` should be greater than 0');
    }
    if (randomDelay.min > randomDelay.max) {
      throw new PactumInteractionError('`willRespondWith.randomDelay.min` should be less than `willRespondWith.randomDelay.max`');
    }
  },

  validateOnCall(onCall) {
    if (helper.isValidObject(onCall)) {
      for (const prop in onCall) {
        try {
          parseInt(prop);
          this.validateWillRespondWith(onCall[prop]);
        } catch(error) {
          throw new PactumInteractionError(`Invalid interaction response onCall provided`);
        }
      }
    }
  }

};

module.exports = validator;