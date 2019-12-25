const Spec = require('./services/spec');
const Server = require('./services/server');

const server = new Server();

const pactum = {

  start(port) {
    return server.start(port);
  },

  stop() {
    return server.stop();
  },

  get(options) {
    const spec = new Spec();
    return spec.get(options)
  }

}

module.exports = pactum;
