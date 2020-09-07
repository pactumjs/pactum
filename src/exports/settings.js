const logger = require('../helpers/logger');

const settings = {

  setLogLevel(level) {
    logger.setLevel(level);
  }

}

module.exports = settings;