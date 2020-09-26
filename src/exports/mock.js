const Interaction = require('../models/interaction');
const Server = require('../models/server');
const { PactumConfigurationError } = require('../helpers/errors');
const log = require('../helpers/logger');
const helper = require('../helpers/helper');
const remote = require('../helpers/remoteServer');
const handler = require('../exports/handler');

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

  addInteraction(interaction, data) {
    if (Array.isArray(interaction)) {
      const rawInteractions = [];
      for (let i = 0; i < interaction.length; i++) {
        let basicInteraction = interaction[i];
        if (typeof basicInteraction === 'string') {
          basicInteraction = handler.getInteractionHandler(basicInteraction)({ data });
        }
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
      if (typeof interaction === 'string') {
        interaction = handler.getInteractionHandler(interaction)({ data });
      }
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

  addMockInteraction(interactions, data) {
    let alone = false;
    if (!Array.isArray(interactions)) {
      alone = true;
      interactions = [interactions];
    }
    if (config.mock.remote) {
      return remote.addMockInteraction(interactions, data);
    }
    const ids = [];
    for (let i = 0; i < interactions.length; i++) {
      let raw = interactions[i];
      if (typeof raw === 'string') {
        raw = handler.getMockInteractionHandler(raw)({ data });
      }
      const interaction = new Interaction(raw, true);
      this._server.addMockInteraction(interaction.id, interaction);
      ids.push(interaction.id);
    }
    return alone ? ids[0] : ids;
  },

  addPactInteraction(interactions, data) {
    let alone = false;
    if (!Array.isArray(interactions)) {
      alone = true;
      interactions = [interactions];
    }
    if (config.mock.remote) {
      return remote.addPactInteraction(interactions, data);
    }
    const ids = [];
    for (let i = 0; i < interactions.length; i++) {
      let raw = interactions[i];
      if (typeof raw === 'string') {
        raw = handler.getPactInteractionHandler(raw)({ data });
      }
      const interaction = new Interaction(raw, false);
      this._server.addPactInteraction(interaction.id, interaction);
      ids.push(interaction.id);
    }
    return alone ? ids[0] : ids;
  },

  getInteraction(ids) {
    let alone = false;
    if (!Array.isArray(ids)) {
      ids = [ids];
      alone = true;
    }
    if (config.mock.remote) {
      return remote.getInteraction(ids);
    }
    const interactions = [];
    ids.forEach(id => interactions.push(this._server.getInteraction(id)));
    interactions.forEach(interaction => { 
      interaction.exercised = interaction.callCount > 0;
    });
    return alone ? interactions[0] : interactions;
  },

  removeInteraction(ids) {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    if (config.mock.remote) {
      return remote.removeInteraction(ids);
    }
    ids.forEach(id => this._server.removeInteraction(id));
  },

  clearInteractions() {
    if (config.mock.remote) {
      return remote.clearInteractions();
    }
    this._server.clearAllInteractions();
  },

  useRemoteServer(url) {
    config.mock.remote = url;
  }

}

module.exports = mock;