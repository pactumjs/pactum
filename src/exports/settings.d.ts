export type LogLevel = 'VERBOSE' | 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'SILENT';

/**
 * @see https://pactumjs.github.io/api/settings/setLogLevel.html
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
/**
 * @see https://pactumjs.github.io/api/settings/setLogger.html
 */
export function setLogger(logger: Logger): void;

export type JsonLikeValidateFunction = (actual: any, expected: any, options?: any) => any;
export interface JsonLikeAdapter {
  validate: JsonLikeValidateFunction;
}
export function setJsonLikeAdapter(adapter: JsonLikeAdapter): void;

export type GetMatchingRulesFunction = (data: any, path: any, rules: any) => any;
export type GetRawValueFunction = (data: any) => any;
export type JsonMatchValidateFunction = (actual: any, expected: any, rules: any, path: any, strict: any) => any;
export interface JsonMatchAdapter {
  getMatchingRules: GetMatchingRulesFunction;
  getRawValue: GetRawValueFunction;
  validate: JsonMatchValidateFunction;
}
export function setJsonMatchAdapter(adapter: JsonMatchAdapter): void;

export type JsonSchemaValidateFunction = (schema: any, target: any, options?: any) => any;
export interface JsonSchemaAdapter {
  validate: JsonSchemaValidateFunction;
}
export function setJsonSchemaAdapter(adapter: JsonSchemaAdapter): void;

export function setFormDataAdapter(adapter: any): void;

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