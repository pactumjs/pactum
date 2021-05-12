export type LogLevel = 'TRACE'|'DEBUG'|'INFO'|'WARN'|'ERROR';

/**
  * sets log level
  * @env PACTUM_LOG_LEVEL
*/
export function setLogLevel(level: LogLevel): void;
export function setLogger(logger: object): void;

export interface Strategy {
  starts?: string;
  ends?: string;
  includes?: string;
}

export function setAssertHandlerStrategy(strategy: Strategy): void;
export function setAssertExpressionStrategy(strategy: Strategy): void;
export function setCaptureHandlerStrategy(strategy: Strategy): void;
export function setSnapshotDirectoryPath(path: string): void;
export function setReporterAutoRun(auto: boolean): void;
export function setDefaultRetryCount(count: number): void;
export function setDefaultRetryDelay(delay: number): void;