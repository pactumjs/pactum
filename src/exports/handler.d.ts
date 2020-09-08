interface StateHandlerContext {
  data?: any;
  spec?: object;
}

export type ExpectHandlerFunction = (req: object, res: object) => void;
export type RetryHandlerFunction = (req: object, res: object) => boolean;
export type ReturnHandlerFunction = (req: object, res: object) => any;
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
