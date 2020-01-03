const Spec = require('./services/spec');
const Server = require('./services/server');

const server = {
  
  _server: new Server(),

  start(port = 3000) {
    return this._server.start(port);
  },

  stop(port = 3000) {
    return this._server.stop(port);
  }

  // stop all servers

}

const pactum = {

  server,

  addInteraction(interaction) {
    if (!this.interactions) {
      this.interactions = []
    }
    this.interactions.push(interaction);
    return this;
  },

  get(options) {
    const spec = new Spec();
    spec.server = server._server;
    if (this.interactions && this.interactions.length > 0) {
      spec.interactions.push(...this.interactions);
    }
    return spec.get(options);
  }

};

module.exports = pactum;
