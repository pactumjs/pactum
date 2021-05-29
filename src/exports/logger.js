const { options, magenta, blue, green, yellow, red } = require('../helpers/colors');

const LEVEL_TRACE = 3;
const LEVEL_DEBUG = 4;
const LEVEL_INFO = 5;
const LEVEL_WARN = 6;
const LEVEL_ERROR = 7;
const LEVEL_SILENT = 8;
const LEVEL_VERBOSE = 9;

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

class Logger {

  constructor() {
    this.console = console;
    // validate log level
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
      process.stdout.write(`[${magenta('T')}] `);
      msg.forEach(m => this.console.debug(m));
    }
  }

  debug(...msg) {
    if (this.levelValue <= LEVEL_DEBUG) {
      process.stdout.write(`[${blue('D')}] `);
      msg.forEach(m => this.console.debug(m));
    }
  }

  info(...msg) {
    if (this.levelValue <= LEVEL_INFO) {
      process.stdout.write(`[${green('I')}] `);
      msg.forEach(m => this.console.info(m));
    }
  }

  warn(...msg) {
    if (this.levelValue <= LEVEL_WARN) {
      process.stdout.write(`[${yellow('W')}] `);
      msg.forEach(m => this.console.warn(getMessage(m)));
    }
  }

  error(...msg) {
    if (this.levelValue <= LEVEL_ERROR) {
      process.stdout.write(`[${red('E')}] `);
      msg.forEach(m => this.console.error(getMessage(m)));
    }
  }

  silent(...msg) {
    if (this.levelValue <= LEVEL_SILENT) {}
    }
}

function getMessage(msg) {
  try {
    return typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg;
  } catch (_) {
    return msg;
  }
}

module.exports = {
  logger: new Logger(),

  get() {
    return this.logger;
  },

  set(lgr) {
    this.logger = lgr;
  }
};