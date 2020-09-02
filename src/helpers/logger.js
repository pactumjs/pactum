const { options, cyan, magenta, blue, green, yellow, red } = require('./colors');

const LEVEL_TRACE = 3;
const LEVEL_DEBUG = 4;
const LEVEL_INFO = 5;
const LEVEL_WARN = 6;
const LEVEL_ERROR = 7;

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
      process.stdout.write(`${cyan('PACTUM')} ${magenta('TRACE')} `);
      this.console.debug(...msg);
    }
  }

  debug(...msg) {
    if (this.levelValue <= LEVEL_DEBUG) {
      process.stdout.write(`${cyan('PACTUM')} ${blue('DEBUG')} `);
      this.console.debug(...msg);
    }
  }

  info(...msg) {
    if (this.levelValue <= LEVEL_INFO) {
      process.stdout.write(`${cyan('PACTUM')} ${green('INFO')} `);
      this.console.info(...msg);
    }
  }

  warn(...msg) {
    if (this.levelValue <= LEVEL_WARN) {
      process.stdout.write(`${cyan('PACTUM')} ${yellow('WARN')} `);
      this.console.warn(...msg);
    }
  }

  error(...msg) {
    if (this.levelValue <= LEVEL_ERROR) {
      process.stdout.write(`${cyan('PACTUM')} ${red('ERROR')} `);
      this.console.error(...msg);
    }
  }

}

module.exports = new Logger();