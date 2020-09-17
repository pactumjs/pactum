export interface BasicInteraction {
  get?: string;
  post?: string;
  put?: string;
  patch?: string;
  delete?: string;
  /** status code to return */
  status?: number;
  /** body to return */
  return?: string | number | object;
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

export interface GraphQLRequest {
  query: string;
  variables?: string;
}

export interface PactInteractionRequest {
  method: RequestMethod;
  path: string;
  headers?: object;
  query?: object;
  graphQL?: GraphQLRequest;
  body?: any;
}

export interface MockInteractionRequest extends PactInteractionRequest {
  /** ignores query while matching this interaction */
  ignoreQuery: boolean;
  /** ignores body while matching this interaction */
  ignoreBody: boolean;
}

export interface PactInteractionResponse {
  status: number;
  headers?: object;
  body?: object;
}

export interface RandomDelay {
  min: number;
  max: number;
}

export interface MockInteractionResponseWithDelay extends PactInteractionResponse {
  fixedDelay?: number;
  randomDelay?: RandomDelay;
}

export interface OnCall {
  [key: number]: MockInteractionResponseWithDelay
}

export interface MockInteractionResponse extends MockInteractionResponseWithDelay {
  onCall?: OnCall
}

// TODO - accept function - (req, res)
export interface MockInteraction {
  id?: string;
  provider?: string;
  withRequest: MockInteractionRequest;
  willRespondWith: MockInteractionResponse;
}

export interface PactInteraction {
  id?: string;
  /** name of the provider */
  provider: string;
  /** state of the provider */
  state: string;
  /** description of the request */
  uponReceiving: string;
  withRequest: PactInteractionRequest;
  willRespondWith: PactInteractionResponse;
}

/**
 * starts the mock server on port 9393
 */
export function start(): Promise<void>;

/**
 * starts the mock server on specified port
 * @example
 * await mock.start(3000);
 */
export function start(port: number): Promise<void>;

/**
 * stops the mock server
 */
export function stop(): Promise<void>;

/**
 * adds a basic mock interaction
 * @returns interaction id
 * @example
 * mock.addInteraction({
 *  get: '/api/users',
 *  return: []
 * });
 */
export function addInteraction(interaction: BasicInteraction): string;
export function addInteraction(interactions: BasicInteraction[]): string[];

/**
 * adds a mock interaction
 * @returns interaction id
 * @example
 * mock.addMockInteraction({
 *  withRequest: {
 *   method: 'GET',
 *   path: '/api/orders'
 *  },
 *  willRespondWith: {
 *   status: 200,
 *   body: 'your orders'
 *  }
 * });
 */
export function addMockInteraction(interaction: MockInteraction): string;
export function addMockInteraction(interaction: MockInteraction[]): string[];

/**
 * adds pact interaction used for contract testing
 * @returns interaction id
 * @example
 * mock.addPactInteraction({
 *  provider: 'order-service',
 *  state: 'there is an order with id 1',
 *  uponReceiving: 'request for order',
 *  withRequest: {
 *   method: 'GET',
 *   path: '/api/orders/1'
 *  },
 *  willRespondWith: {
 *   status: 200,
 *   body: 'your order with id 1'
 *  }
 * });
 */
export function addPactInteraction(interaction: PactInteraction): string;
export function addPactInteraction(interactions: PactInteraction[]): string[];

/**
 * removes specified interaction from the mock server
 * @param id interaction id
 */
export function removeInteraction(id: string): void;

/**
 * clears all interactions from the server
 */
export function clearInteractions(): void;

/**
 * returns true if specified interaction is exercised
 * @param id interaction id
 */
export function isInteractionExercised(id: string): boolean;

/**
 * returns the number of time the interaction is used
 * @param id interaction id
 */
export function getInteractionCallCount(id: string): number;