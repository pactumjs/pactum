export * as FormData from 'form-data';

/**
 * adds default headers to all the requests
 */
export function setDefaultHeaders(key: string, value: string): void;
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

export type SourceType = 'REQ_HEADERS'|'REQ_BODY'|'RES_HEADERS'|'RES_BODY';

/**
 * records data to be available in reports
 */
export function setDefaultRecorders(name: string, source: SourceType, path: string): void;