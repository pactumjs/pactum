export * as FormData from 'form-data';

/**
 * adds a default header to all the requests
 */
export function setDefaultHeader(key: string, value: string): void;

/**
 * adds default headers to all the requests
 */
export function setDefaultHeaders(headers: object): void;

/**
 * sets a default timeout to all the requests in ms
 * @default 3000 ms
 * @env PACTUM_REQUEST_TIMEOUT
 */
export function setDefaultTimeout(timeout: number): void;

/**
 * sets base url
 * @env PACTUM_REQUEST_BASE_URL 
 */
export function setBaseUrl(url: string): void;

/**
 * removes default header
 */
export function removeDefaultHeader(key: string): void;

/**
 * removes all default headers
 */
export function removeDefaultHeaders(): void;