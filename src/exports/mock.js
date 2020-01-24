const Interaction = require('../models/interaction');

const config = require('../config');

let _server;

class Mock {

  constructor(ser) {
    _server = ser;
  }

  start(port = config.mock.port) {
    return _server.start(port);
  }

  stop(port = config.mock.port) {
    return _server.stop(port);
  }

  setDefaultPort(port) {
    config.mock.port = port;
  }

  /**
   * add an mock interaction to default list
   * @param {Interaction} interaction - mock interaction
   */
  addDefaultMockInteraction(interaction) {
    const interactionObj = new Interaction(interaction, true);
    _server.addDefaultMockInteraction(interactionObj.id, interactionObj);
    return interactionObj.id;
  }

  removeDefaultMockInteraction(interactionId, port = config.mock.port) {
    _server.removeDefaultMockInteraction(interactionId, port);
  }

  removeDefaultMockInteractions(port = config.mock.port) {
    _server.removeDefaultMockInteractions(port);
  }

  // stop all _servers

}

module.exports = Mock;