import { EventEmitter } from 'node:events';

export const EVENT_TYPES: {
  BEFORE_REQUEST: 'BEFORE_REQUEST';
  AFTER_RESPONSE: 'AFTER_RESPONSE';
};

export const events: EventEmitter;