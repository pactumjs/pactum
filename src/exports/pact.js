const config = require('../config');
const store = require('../helpers/store');

class Pact {

  setPactFilesDirectory(path) {
    config.pact.dir = path;
  }

  setConsumerName(name) {
    config.pact.consumer = name;
  }

  save() {
    store.save();
  }

  // publish pacts
}

module.exports = Pact;