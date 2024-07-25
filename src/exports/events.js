const { EventEmitter } = require('events');

/**
 * @deprecated
 */
const events = new EventEmitter();

const pactumEvents = new EventEmitter();

const EVENT_TYPES = {
  BEFORE_REQUEST: "BEFORE_REQUEST",
  AFTER_RESPONSE: "AFTER_RESPONSE",
}

module.exports = {
  events,
  pactumEvents,
  EVENT_TYPES
}