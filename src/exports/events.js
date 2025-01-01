const { EventEmitter } = require('events');

const pactumEvents = new EventEmitter();

const EVENT_TYPES = {
  BEFORE_REQUEST: "BEFORE_REQUEST",
  AFTER_RESPONSE: "AFTER_RESPONSE",
  AFTER_RESPONSE_ERROR: "AFTER_RESPONSE_ERROR",
}

module.exports = {
  pactumEvents,
  EVENT_TYPES
}