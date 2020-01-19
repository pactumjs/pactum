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

  get(url) {
    return new Spec(server).get(url);
  },

  head(url) {
    return new Spec(server).head(url);
  },

  options(url) {
    return new Spec(server).options(url);
  },

  patch(url) {
    return new Spec(server).patch(url);
  },

  post(url) {
    return new Spec(server).post(url);
  },

  put(url) {
    return new Spec(server).put(url);
  },

  delete(url) {
    return new Spec(server).delete(url);
  }

};

module.exports = pactum;
