const Spec = require('./models/spec');
const Server = require('./models/server');

const server = new Server();

const mock = {

  start(port = 3000) {
    return server.start(port);
  },

  stop(port = 3000) {
    return server.stop(port);
  }

  // stop all servers

}

const pactum = {

  mock,

  addInteraction(interaction) {
    const spec = new Spec(server);
    return spec.addInteraction(interaction);
  },

  get(options) {
    const spec = new Spec(server);
    return spec.get(options);
  }

};

module.exports = pactum;
