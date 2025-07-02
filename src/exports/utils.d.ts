export function clone<T>(input: T): T;

/**
 * sleeps for a certain amount of time
 * @param {number} ms the amount of time to sleep in milliseconds
 * @returns
 */
export function sleep(ms: number): Promise<void>;

/**
 * Finds a file recursively in a directory.
 * @param name - The name of the file.
 * @param dir - The directory to search in. Defaults to config.data.dir.
 * @param encoding - Optional encoding (e.g., 'utf8'). If provided, returns a string; otherwise, returns a Buffer.
 * @returns The file contents as a string (if encoding is set) or Buffer (default).
 */
export function findFile(name: string, dir?: string, encoding?: BufferEncoding | null): string | Buffer;