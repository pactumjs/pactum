import * as Spec from '../models/Spec';
import { MockInteraction, PactInteraction } from './mock';
import { IncomingMessage } from 'http';

interface Request {
  url: string;
  method: string;
  timeout: number;
  data?: any;
}

interface Response extends IncomingMessage {
  json?: object;
}

interface StateHandlerContext {
  data?: any;
  spec?: Spec;
}

interface RequestResponseContext {
  req: Request;
  res: Response;
}

interface ExpectHandlerContext extends RequestResponseContext {
  data?: any;
}

interface DataHandlerContext {
  data?: any;
}

export type ExpectHandlerFunction = (ctx: ExpectHandlerContext) => void;
export type RetryHandlerFunction = (ctx: RequestResponseContext) => boolean;
export type ReturnHandlerFunction = (ctx: RequestResponseContext) => any;
export type StateHandlerFunction = (ctx: StateHandlerContext) => any;
export type DataHandlerFunction = (ctx: DataHandlerContext) => any;
export type MockInteractionHandlerFunction = (ctx: DataHandlerContext) => MockInteraction;
export type PactInteractionHandlerFunction = (ctx: DataHandlerContext) => PactInteraction;

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

/**
 * adds a custom data handler
 */
export function addDataHandler(name: string, func: DataHandlerFunction): void;

/**
 * adds a custom mock interaction handler
 */
export function addMockInteractionHandler(name: string, func: MockInteractionHandlerFunction): void;

/**
 * adds a custom pact interaction handler
 */
export function addPactInteractionHandler(name: string, func: PactInteractionHandlerFunction): void;