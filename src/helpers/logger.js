const pino = require('pino');

const log = pino({
  name: 'PACTUM',
  level: process.env.PACTUM_LOG_LEVEL || 'info',
  useLevelLabels: true,
  nestedKey: 'payload'
});

module.exports = log;