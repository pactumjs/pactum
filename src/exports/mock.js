const Interaction = require('../models/Interaction.model');
const Server = require('../models/server');
const { PactumConfigurationError } = require('../helpers/errors');
const hr = require('../helpers/handler.runner');
const remote = require('../helpers/remoteServer');

const config = require('../config');

const mock = {

  _server: new Server(),

  start(port, host) {
    this.setDefaults(port, host)
    return this._server.start();
  },

  stop() {
    return this._server.stop();
  },

  setDefaults(port, host) {
    if (port && typeof port !== 'number') {
      throw new PactumConfigurationError(`Invalid port number provided - ${port}`);
    }
    if (host && typeof host !== 'string') {
      throw new PactumConfigurationError(`Invalid host provided - ${host}`);
    }
    if (port) {
      config.mock.port = port;
    }
    if (host) {
      config.mock.host = host;
    }
  },

  addInteraction(interactions, data) {
    let alone = false;
    if (!Array.isArray(interactions)) {
      alone = true;
      interactions = [interactions];
    }
    if (config.mock.remote) {
      return remote.addInteraction(interactions, data, alone);
    }
    const ids = [];
    for (let i = 0; i < interactions.length; i++) {
      let raw = interactions[i];
      if (typeof raw === 'string') {
        raw = hr.interaction(raw, data);
      } else if (typeof raw === 'object' && typeof raw.name === 'string') {
        raw = hr.interaction(raw.name, raw.data || data);
      }
      if (!Array.isArray(raw)) {
        raw = [raw];
      } else {
        alone = false;
      }
      for (let j = 0; j < raw.length; j++) {
        const interaction = new Interaction(raw[j], true);
        this._server.addInteraction(interaction.id, interaction);
        ids.push(interaction.id);
      }
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
      return remote.getInteraction(ids, alone);
    }
    const interactions = [];
    ids.forEach(id => interactions.push(this._server.getInteraction(id)));
    interactions.forEach(interaction => {
      if (interaction) {
        interaction.exercised = interaction.callCount > 0;
      }
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
    this._server.clearInteractions();
  },

  useRemoteServer(url) {
    config.mock.remote = url;
  }

};

module.exports = mock;