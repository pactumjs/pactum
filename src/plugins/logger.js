const BasePlugin = require('./plugin.base');
const { options } = require('../helpers/colors');

const LEVEL_VERBOSE = 2;
const LEVEL_TRACE = 3;
const LEVEL_DEBUG = 4;
const LEVEL_INFO = 5;
const LEVEL_WARN = 6;
const LEVEL_ERROR = 7;
const LEVEL_SILENT = 8;

/**
 * returns log level value
 * @param {string} level - log level
 */
function getLevelValue(level) {
  const logLevel = level.toUpperCase();
  switch (logLevel) {
    case 'TRACE':
      return LEVEL_TRACE;
    case 'DEBUG':
      return LEVEL_DEBUG;
    case 'INFO':
      return LEVEL_INFO;
    case 'WARN':
      return LEVEL_WARN;
    case 'ERROR':
      return LEVEL_ERROR;
    case 'SILENT':
      return LEVEL_SILENT;
    case 'VERBOSE':
      return LEVEL_VERBOSE;
    default:
      return LEVEL_INFO;
  }
}

class Logger extends BasePlugin {

  constructor() {
    super();
    this.level = process.env.PACTUM_LOG_LEVEL || 'INFO';
    this.levelValue = getLevelValue(this.level);
    if (process.env.PACTUM_DISABLE_LOG_COLORS === 'true') {
      options.disableColors = true;
    }
  }

  /**
   * sets log level
   * @param {('TRACE'|'DEBUG'|'INFO'|'WARN'|'ERROR')} level - log level
   */
  setLevel(level) {
    this.level = level;
    this.levelValue = getLevelValue(this.level);
  }

  trace(...msg) {
    if (this.levelValue <= LEVEL_TRACE) {
      this.adapter.trace(msg);
    }
  }

  debug(...msg) {
    if (this.levelValue <= LEVEL_DEBUG) {
      this.adapter.debug(msg);
    }
  }

  info(...msg) {
    if (this.levelValue <= LEVEL_INFO) {
      this.adapter.info(msg);
    }
  }

  warn(...msg) {
    if (this.levelValue <= LEVEL_WARN) {
      this.adapter.warn(msg);
    }
  }

  error(...msg) {
    if (this.levelValue <= LEVEL_ERROR) {
      this.adapter.error(msg);
    }
  }

}

module.exports = new Logger();
