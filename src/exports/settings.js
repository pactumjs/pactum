const logger = require('../helpers/logger');

const settings = {

  /**
   * sets log level
   * @param {('TRACE'|'DEBUG'|'INFO'|'WARN'|'ERROR')} level - log level
   */
  setLogLevel(level) {
    logger.setLevel(level);
  }

}

module.exports = settings;