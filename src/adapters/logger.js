const { magenta, blue, green, yellow, red } = require('../helpers/colors');
const trm = console;

function trace(msg) {
  process.stdout.write(`[${magenta('T')}] `);
  msg.forEach(m => trm.debug(m));
}

function debug(msg) {
  process.stdout.write(`[${blue('D')}] `);
  msg.forEach(m => trm.debug(m));
}

function info(msg) {
  process.stdout.write(`[${green('I')}] `);
  msg.forEach(m => trm.info(m));
}

function warn(msg) {
  process.stdout.write(`[${yellow('W')}] `);
  msg.forEach(m => trm.warn(getMessage(m)));
}

function error(msg) {
  process.stdout.write(`[${red('E')}] `);
  msg.forEach(m => trm.error(getMessage(m)));
}

function getMessage(msg) {
  try {
    return typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg;
  } catch (_) {
    return msg;
  }
}

module.exports = {
  trace,
  debug,
  info,
  warn,
  error
};