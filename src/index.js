const Spec = require('./models/spec');
const Server = require('./models/server');
const Matcher = require('./models/matcher');
const store = require('./helpers/store');

const config = require('./config');

const server = new Server();
const matchers = new Matcher();

const mock = {

  start(port = 3000) {
    return server.start(port);
  },

  stop(port = 3000) {
    return server.stop(port);
  }

  // stop all servers

}

const pact = {
  save() {
    store.save();
  }
}

const configuration = {
  setPactFilesDirectory(path) {
    config.pactFiles.dir = path;
  }
}

const pactum = {

  mock,
  matchers,
  pact,
  configuration,
  
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
