const Interaction = require('../models/interaction');
const Server = require('../models/server');
const { PactumConfigurationError, PactumInteractionError } = require('../helpers/errors');
const log = require('../helpers/logger');
const helper = require('../helpers/helper');

const config = require('../config');

const mock = {

  _server: new Server(),

  start(port) {
    if (port) {
      this.setDefaultPort(port);
    }
    return this._server.start();
  },

  stop() {
    return this._server.stop();
  },

  setDefaultPort(port) {
    log.debug('Setting default port number for mock server', port);
    if (typeof port !== 'number') {
      throw new PactumConfigurationError(`Invalid port number provided - ${port}`);
    }
    config.mock.port = port;
  },

  addInteraction(basicInteraction) {
    const rawInteraction = {
      withRequest: helper.getRequestFromBasicInteraction(basicInteraction),
      willRespondWith: {
        status: basicInteraction.status || 200,
        body: basicInteraction.return || ''
      }
    };
    return this.addMockInteraction(rawInteraction);
  },

  addInteractions(basicInteractions) {
    const rawInteractions = [];
    for (let i = 0; i < basicInteractions.length; i++) {
      const basicInteraction = basicInteractions[i];
      const rawInteraction = {
        withRequest: helper.getRequestFromBasicInteraction(basicInteraction),
        willRespondWith: {
          status: basicInteraction.status || 200,
          body: basicInteraction.return || ''
        }
      };
      rawInteractions.push(rawInteraction);
    }
    return this.addMockInteractions(rawInteractions);
  },

  addMockInteraction(interaction) {
    const interactionObj = new Interaction(interaction, true);
    this._server.addMockInteraction(interactionObj.id, interactionObj);
    log.debug('Added default mock interaction with id', interactionObj.id);
    return interactionObj.id;
  },

  addMockInteractions(interactions) {
    if (!Array.isArray(interactions)) {
      throw new PactumInteractionError(`Invalid mock interactions array passed - ${interactions}`);
    }
    const ids = [];
    for (let i = 0; i < interactions.length; i++) {
      const interactionObj = new Interaction(interactions[i], true);
      this._server.addMockInteraction(interactionObj.id, interactionObj);
      ids.push(interactionObj.id);
      // this._interactionIds.add(interactionObj.id);
    }
    log.debug('Added default mock interactions with ids', ids);
    return ids;
  },

  addPactInteraction(interaction) {
    const interactionObj = new Interaction(interaction);
    this._server.addPactInteraction(interactionObj.id, interactionObj);
    log.debug('Added default pact interactions with id', interactionObj.id);
    return interactionObj.id;
  },

  addPactInteractions(interactions) {
    if (!Array.isArray(interactions)) {
      throw new PactumInteractionError(`Invalid pact interactions array passed - ${interactions}`);
    }
    const ids = [];
    for (let i = 0; i < interactions.length; i++) {
      const interactionObj = new Interaction(interactions[i], false);
      this._server.addPactInteraction(interactionObj.id, interactionObj);
      ids.push(interactionObj.id);
    }
    log.debug('Added default pact interactions with ids', ids);
    return ids;
  },

  removeInteraction(interactionId) {
    if (typeof interactionId !== 'string' || !interactionId) {
      throw new PactumInteractionError(`Invalid interaction id - ${interactionId}`);
    }
    this._server.removeInteraction(interactionId);
  },

  clearInteractions() {
    this._server.clearAllInteractions();
  },

  isInteractionExercised(id) {
    return this._server.getInteractionDetails(id).exercised;
  },

  getInteractionCallCount(id) {
    return this._server.getInteractionDetails(id).callCount;
  }

}

module.exports = mock;