const winston = require('winston');
const { format } = winston;


const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = new winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: format.combine(
        format.label({label: 'pactum'}),
        format.splat(),
        format.json(),
        format.timestamp(),
        format.colorize(),
        myFormat
      )
    })
  ],
  exitOnError: false
});

module.exports = logger;
