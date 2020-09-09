import * as Spec from '../models/Spec';

interface StateHandlerContext {
  data?: any;
  spec?: Spec;
}

interface RequestResponseContext {
  req: object;
  res: object;
}

interface RequestResponseDataContext {
  req: object;
  res: object;
  data?: any;
}

export type ExpectHandlerFunction = (ctx: RequestResponseDataContext) => void;
export type RetryHandlerFunction = (ctx: RequestResponseContext) => boolean;
export type ReturnHandlerFunction = (ctx: RequestResponseContext) => any;
export type StateHandlerFunction = (ctx: StateHandlerContext) => any;

/**
 * adds a custom expect handler
 */
export function addExpectHandler(name: string, func: ExpectHandlerFunction): void;

/**
 * adds a custom retry handler
 */
export function addRetryHandler(name: string, func: RetryHandlerFunction): void;

/**
 * adds a custom return handler
 */
export function addReturnHandler(name: string, func: ReturnHandlerFunction): void;

/**
 * adds a custom state handler
 */
export function addStateHandler(name: string, func: StateHandlerFunction): void;
