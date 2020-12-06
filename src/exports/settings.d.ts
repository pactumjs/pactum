export type LogLevel = 'TRACE'|'DEBUG'|'INFO'|'WARN'|'ERROR';

/**
  * sets log level
  * @env PACTUM_LOG_LEVEL
*/
export function setLogLevel(level: LogLevel): void;

export interface Strategy {
  starts?: string;
  ends?: string;
  includes?: string;
}

export function setAssertHandlerStrategy(strategy: Strategy): void;
export function setAssertExpressionStrategy(strategy: Strategy): void;
export function setCaptureHandlerStrategy(strategy: Strategy): void;
export function setSnapshotDirectoryPath(path: string): void;