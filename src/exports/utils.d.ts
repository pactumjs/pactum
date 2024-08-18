export function clone<T>(input: T): T;

/**
 * sleeps for a certain amount of time
 * @param {number} ms the amount of time to sleep in milliseconds
 * @returns
 */
export function sleep(ms: number): Promise<void>;

/**
 * find a file recursively in a directory
 * @param name  the name of the file
 * @param dir the directory to search in. Defaults to config.data.dir
 */
export function findFile(name: string, dir?: string): string;


/**
 * Adds header(s) to list of headers to redact
 * @param headers Header(s) to redact
 * @example
 * addRedactHeaders(['proxy-api-key', 'token'])
 * addRedactHeaders('Session-ID')
 */
export function addRedactHeaders(headers: string[]): void;
export function addRedactHeaders(headers: string): void;