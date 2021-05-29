import { ExpectHandlerFunction } from './handler';

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
 * sets default custom expect handlers
 */
export function setDefaultExpectHandlers(handlerName: string, data?: any): void;
export function setDefaultExpectHandlers(handler: ExpectHandlerFunction): void;

/**
 * removes default expect header
 */
export function removeDefaultExpectHeader(key: string): void;

/**
 * removes all default expect headers
 */
export function removeDefaultExpectHeaders(): void;

/**
* removes all default expect handlers
*/
export function removeDefaultExpectHandlers(): void;