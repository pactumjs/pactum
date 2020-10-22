export type LogLevel = 'TRACE'|'DEBUG'|'INFO'|'WARN'|'ERROR';

/**
  * sets log level
  * @env PACTUM_LOG_LEVEL
*/
export function setLogLevel(level: LogLevel): void;

export function setAssertHandlerStartsWith(value: string): void;