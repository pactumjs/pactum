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

  addInteraction(interaction) {
    if (Array.isArray(interaction)) {
      const rawInteractions = [];
      for (let i = 0; i < interaction.length; i++) {
        const basicInteraction = interaction[i];
        const rawInteraction = {
          withRequest: helper.getRequestFromBasicInteraction(basicInteraction),
          willRespondWith: {
            status: basicInteraction.status || 200,
            body: basicInteraction.return || ''
          }
        };
        rawInteractions.push(rawInteraction);
      }
      return this.addMockInteraction(rawInteractions);
    } else {
      const rawInteraction = {
        withRequest: helper.getRequestFromBasicInteraction(interaction),
        willRespondWith: {
          status: interaction.status || 200,
          body: interaction.return || ''
        }
      };
      return this.addMockInteraction(rawInteraction);
    }
  },

  addMockInteraction(interaction) {
    if (Array.isArray(interaction)) {
      const ids = [];
      for (let i = 0; i < interaction.length; i++) {
        const interactionObj = new Interaction(interaction[i], true);
        this._server.addMockInteraction(interactionObj.id, interactionObj);
        ids.push(interactionObj.id);
      }
      log.debug('Added default mock interactions with ids', ids);
      return ids;
    } else {
      const interactionObj = new Interaction(interaction, true);
      this._server.addMockInteraction(interactionObj.id, interactionObj);
      log.debug('Added default mock interaction with id', interactionObj.id);
      return interactionObj.id;
    }
  },

  addPactInteraction(interaction) {
    if (Array.isArray(interaction)) {
      const ids = [];
      for (let i = 0; i < interaction.length; i++) {
        const interactionObj = new Interaction(interaction[i], false);
        this._server.addPactInteraction(interactionObj.id, interactionObj);
        ids.push(interactionObj.id);
      }
      log.debug('Added default pact interactions with ids', ids);
      return ids;
    } else {
      const interactionObj = new Interaction(interaction);
      this._server.addPactInteraction(interactionObj.id, interactionObj);
      log.debug('Added default pact interactions with id', interactionObj.id);
      return interactionObj.id;
    }
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