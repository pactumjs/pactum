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

export interface MockInteractionResponse extends InteractionResponseWithDelay {
  onCall?: OnCall
}

export interface InteractionExpectations {
  exercised?: boolean;
  callCount?: number;
}

// TODO - accept function - (req, res)
export interface MockInteraction {
  id?: string;
  /** name of the provider */
  provider?: string;
  /** flow of the provider */
  flow?: string;
  withRequest: InteractionRequest;
  willRespondWith: MockInteractionResponse;
  expects?: InteractionExpectations;
}

export interface PactInteraction {
  id?: string;
  /** name of the provider */
  provider: string;
  /** state of the provider */
  state: string;
  /** description of the request */
  uponReceiving: string;
  withRequest: InteractionRequest;
  willRespondWith: InteractionResponse;
  expects?: InteractionExpectations;
}

export interface InteractionDetails {
  id: string;
  exercised: boolean;
  callCount: number;
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
export function addMockInteraction(interaction: MockInteraction | string): string;
export function addMockInteraction(interaction: MockInteraction[] | string[]): string[];
export function addMockInteraction(interaction: MockInteraction | string): Promise<string>;
export function addMockInteraction(interaction: MockInteraction[] | string[]): Promise<string[]>;

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
export function addPactInteraction(interaction: PactInteraction | string): string;
export function addPactInteraction(interactions: PactInteraction[] | string[]): string[];
export function addPactInteraction(interaction: PactInteraction | string): Promise<string>;
export function addPactInteraction(interactions: PactInteraction[] | string[]): Promise<string[]>;
/**
 * returns interaction details
 */
export function getInteraction(id: string): InteractionDetails;
export function getInteraction(ids: string[]): InteractionDetails[];
export function getInteraction(id: string): Promise<InteractionDetails>;
export function getInteraction(ids: string[]): Promise<InteractionDetails[]>;

/**
 * removes specified interaction from the mock server
 * @param id interaction id
 */
export function removeInteraction(id: string): void;
export function removeInteraction(ids: string[]): void;
export function removeInteraction(id: string): Promise<void>;
export function removeInteraction(ids: string[]): Promise<void>;

/**
 * clears all interactions from the server
 */
export function clearInteractions(): void;

/**
 * use remote pactum server
 * all methods in mock will return promises
 */
export function useRemoteServer(url: string): void;