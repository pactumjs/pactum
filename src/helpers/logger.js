const colors = require('colors');

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
  const lowerCaseLevel = level.toLowerCase();
  switch (lowerCaseLevel) {
    case 'trace':
      return LEVEL_TRACE;
    case 'debug':
      return LEVEL_DEBUG;
    case 'info':
      return LEVEL_INFO;
    case 'warn':
      return LEVEL_WARN;
    case 'error':
      return LEVEL_ERROR;
    default:
      return LEVEL_INFO;
  }
}

class Logger {

  constructor() {
    this.console = console;
    // validate log level
    this.level = process.env.PACTUM_LOG_LEVEL || 'info';
    this.levelValue = getLevelValue(this.level);
    if (process.env.PACTUM_DISABLE_LOG_COLORS === 'true') {
      colors.disable();
    }
  }

  trace(...msg) {
    if (this.levelValue <= LEVEL_TRACE) {
      process.stdout.write(`${'PACTUM'.cyan} ${'TRACE'.magenta} `);
      this.console.debug(...msg);
    }
  }

  debug(...msg) {
    if (this.levelValue <= LEVEL_DEBUG) {
      process.stdout.write(`${'PACTUM'.cyan} ${'DEBUG'.blue} `);
      this.console.debug(...msg);
    }
  }

  info(...msg) {
    if (this.levelValue <= LEVEL_INFO) {
      process.stdout.write(`${'PACTUM'.cyan} ${'INFO'.green} `);
      this.console.info(...msg);
    }
  }

  warn(...msg) {
    if (this.levelValue <= LEVEL_WARN) {
      process.stdout.write(`${'PACTUM'.cyan} ${'WARN'.yellow} `);
      this.console.warn(...msg);
    }
  }

  error(...msg) {
    if (this.levelValue <= LEVEL_ERROR) {
      process.stdout.write(`${'PACTUM'.cyan} ${'ERROR'.red} `);
      this.console.error(...msg);
    }
  }

}

module.exports = new Logger();