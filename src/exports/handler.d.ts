import * as Spec from '../models/Spec';
import { Interaction } from './mock';
import { IncomingMessage } from 'http';

interface PactumRequest {
  url: string;
  method: string;
  timeout: number;
  data?: any;
}

interface PactumResponse extends IncomingMessage {
  json?: object;
  body?: any;
  text?: string;
  buffer?: Buffer;
}

interface StateHandlerContext {
  data?: any;
  spec?: Spec;
}

interface SpecHandlerContext {
  spec: Spec;
  data?: any;
}

interface RequestResponseContext {
  req: PactumRequest;
  res: PactumResponse;
}

interface CaptureContext extends RequestResponseContext {
  store?: object;
}

interface ExpectHandlerContext extends RequestResponseContext {
  data?: any;
}

interface DataHandlerContext {
  args?: string[];
}

interface AssertionContext {
  data: any;
  args?: string[];
}

interface InteractionContext {
  data?: any;
}

interface ParentHandler {
  name: string;
  data?: any;
}

interface WaitHandlerContext extends RequestResponseContext {
  data?: any;
  rootData?: any;
}

export type SpecHandlerFunction = (ctx: SpecHandlerContext) => void;
export type ExpectHandlerFunction = (ctx: ExpectHandlerContext) => void;
export type RetryHandlerFunction = (ctx: RequestResponseContext) => boolean;
export type CaptureHandlerFunction = (ctx: CaptureContext) => any;
export type StateHandlerFunction = (ctx: StateHandlerContext) => any;
export type DataHandlerFunction = (ctx: DataHandlerContext) => any;
export type InteractionHandlerFunction = (ctx: InteractionContext) => Interaction | ParentHandler | Interaction[] | ParentHandler[];
export type AssertHandlerFunction = (ctx: AssertionContext) => boolean;
export type WaitHandlerFunction = (ctx: WaitHandlerContext) => any | Promise<any>;

/**
 * adds a custom spec handler
 * @see https://pactumjs.github.io/api/handlers/addSpecHandler.html
 */
export function addSpecHandler(name: string, func: SpecHandlerFunction): void;

/**
 * adds a custom expect handler
 * @see https://pactumjs.github.io/api/handlers/addExpectHandler.html
 */
export function addExpectHandler(name: string, func: ExpectHandlerFunction): void;

/**
 * adds a custom retry handler
 * @see https://pactumjs.github.io/api/handlers/addRetryHandler.html
 */
export function addRetryHandler(name: string, func: RetryHandlerFunction): void;

/**
 * adds a custom return handler
 * @see https://pactumjs.github.io/api/handlers/addCaptureHandler.html
 */
export function addCaptureHandler(name: string, func: CaptureHandlerFunction): void;

/**
 * adds a custom state handler
 * @see https://pactumjs.github.io/api/handlers/addStateHandler.html
 */
export function addStateHandler(name: string, func: StateHandlerFunction): void;

/**
 * adds a custom data handler
 * @see https://pactumjs.github.io/api/handlers/addDataFuncHandler.html
 */
export function addDataFuncHandler(name: string, func: DataHandlerFunction): void;

/**
 * adds a custom interaction handler
 * @see https://pactumjs.github.io/api/handlers/addInteractionHandler.html
 */
export function addInteractionHandler(name: string, func: InteractionHandlerFunction): void;

/**
 * adds a custom assert handler
 * @see https://pactumjs.github.io/api/handlers/addAssertHandler.html
 */
export function addAssertHandler(name: string, func: AssertHandlerFunction): void;

/**
 * adds a custom wait handler
 * @see https://pactumjs.github.io/api/handlers/addWaitHandler.html
 */
export function addWaitHandler(name: string, func: WaitHandlerFunction): void;