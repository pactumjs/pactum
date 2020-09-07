interface StateHandlerContext {
  data?: any;
  spec?: object;
}

type expectHandlerFunction = (req: object, res: object) => void;
type retryHandlerFunction = (req: object, res: object) => boolean;
type returnHandlerFunction = (req: object, res: object) => any;
type stateHandlerFunction = (ctx: StateHandlerContext) => any;

/**
 * adds a custom expect handler
 */
export function addExpectHandler(name: string, func: expectHandlerFunction): void;

/**
 * adds a custom retry handler
 */
export function addRetryHandler(name: string, func: retryHandlerFunction): void;

/**
 * adds a custom return handler
 */
export function addReturnHandler(name: string, func: returnHandlerFunction): void;

/**
 * adds a custom state handler
 */
export function addStateHandler(name: string, func: stateHandlerFunction): void;
