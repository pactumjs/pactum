/**
 * adds default headers to all the requests
 */
export function setDefaultHeaders(key: string, value: string): void;
export function setDefaultHeaders(headers: object): void;

export function setBasicAuth(username: string, password: string): void;
export function setBearerToken(token: string): void;

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
 * sets default value for follow redirects
 */
export function setFollowRedirects(follow: boolean): void;

/**
 * removes all or selective default headers
 */
export function removeDefaultHeaders(key?: string): void;

/**
 * records data that will be available in reports
 */
export function setDefaultRecorders(name: string, path: string): void;