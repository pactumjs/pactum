const { EventEmitter } = require('events');

const events = new EventEmitter();

const EVENT_TYPES = {
  BEFORE_REQUEST: "BEFORE_REQUEST",
  AFTER_RESPONSE: "AFTER_RESPONSE",
}

module.exports = {
  events,
  EVENT_TYPES
}