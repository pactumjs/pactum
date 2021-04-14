/**
 * sets default expected response headers to all the responses
 */
export function setDefaultExpectHeaders(key: string, value: string): void;
export function setDefaultExpectHeaders(headers: object): void;

/**
 * sets a default expected response time for all responses in ms
 * @env PACTUM_RESPONSE_TIME
 */
export function setDefaultExpectResponseTime(respTime: number): void;

/**
 * sets default expected response status
 * @env PACTUM_RESPONSE_STATUS 
 */
export function setDefaultExpectStatus(status: number): void;

/**
 * removes default header
 */
 export function removeDefaultExpectHeader(key: string): void;

 /**
  * removes all default headers
  */
 export function removeDefaultExpectHeaders(): void;