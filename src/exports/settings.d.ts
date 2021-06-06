export type LogLevel = 'VERBOSE' | 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'SILENT';

/**
  * sets log level
  * @env PACTUM_LOG_LEVEL
*/
export function setLogLevel(level: LogLevel): void;

export type LogFunction = (messages: any[]) => void;
export interface Logger {
  trace: LogFunction;
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;
}
export function setLogger(logger: Logger): void;

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
export function setRequestDefaultRetryCount(count: number): void;
export function setRequestDefaultRetryDelay(delay: number): void;