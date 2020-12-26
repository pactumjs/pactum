export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

export interface GraphQLRequest {
  query: string;
  variables?: string;
}

export interface InteractionRequest {
  method: RequestMethod;
  path: string;
  pathParams?: object;
  headers?: object;
  query?: object;
  graphQL?: GraphQLRequest;
  body?: any;
}

export interface InteractionResponse {
  status: number;
  headers?: object;
  body?: object;
}

export interface RandomDelay {
  min: number;
  max: number;
}

export interface InteractionResponseWithDelay extends InteractionResponse {
  fixedDelay?: number;
  randomDelay?: RandomDelay;
}

export interface OnCall {
  [key: number]: InteractionResponseWithDelay
}

export interface InteractionResponse extends InteractionResponseWithDelay {
  onCall?: OnCall
}

export interface InteractionExpectations {
  exercised?: boolean;
  callCount?: number;
}

// TODO - accept function - (req, res)
export interface Interaction {
  id?: string;
  /** name of the provider */
  provider?: string;
  /** flow of the provider */
  flow?: string;
  strict: boolean;
  request: InteractionRequest;
  response: InteractionResponse;
  expects?: InteractionExpectations;
}

export interface InteractionDetails {
  id: string;
  exercised: boolean;
  callCount: number;
}

export interface Handler {
  name: string;
  data?: any;
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
 * adds a interaction
 * @returns interaction id
 * @example
 * mock.addInteraction({
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
export function addInteraction(interaction: Interaction): string | Promise<string>;
export function addInteraction(interactions: Interaction[]): string[] | Promise<string[]>;
export function addInteraction(handler: string, data?: any): string | Promise<string>;
export function addInteraction(handlers: string[], data?: any): string[] | Promise<string[]>;
export function addInteraction(handler: Handler, data?: any): string | Promise<string>;
export function addInteraction(handlers: Handler[], data?: any): string[] | Promise<string[]>;

// /**
//  * adds pact interaction used for contract testing
//  * @returns interaction id
//  * @example
//  * mock.addPactInteraction({
//  *  provider: 'order-service',
//  *  state: 'there is an order with id 1',
//  *  uponReceiving: 'request for order',
//  *  withRequest: {
//  *   method: 'GET',
//  *   path: '/api/orders/1'
//  *  },
//  *  willRespondWith: {
//  *   status: 200,
//  *   body: 'your order with id 1'
//  *  }
//  * });
//  */
// export function addPactInteraction(interaction: PactInteraction | string): string;
// export function addPactInteraction(interactions: PactInteraction[] | string[]): string[];
// export function addPactInteraction(interaction: PactInteraction | string): Promise<string>;
// export function addPactInteraction(interactions: PactInteraction[] | string[]): Promise<string[]>;
/**
 * returns interaction details
 */
export function getInteraction(id: string): InteractionDetails | Promise<InteractionDetails>;
export function getInteraction(ids: string[]): InteractionDetails[] | Promise<InteractionDetails[]>;

/**
 * removes specified interaction from the mock server
 * @param id interaction id
 */
export function removeInteraction(id: string): void | Promise<void>;
export function removeInteraction(ids: string[]): void | Promise<void>;

/**
 * clears all interactions from the server
 */
export function clearInteractions(): void;

/**
 * use remote pactum server
 * all methods in mock will return promises
 */
export function useRemoteServer(url: string): void;