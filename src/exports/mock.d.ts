export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'TRACE';

export interface GraphQLRequest {
  query: string;
  variables?: string;
}

export interface InteractionRequest {
  method: RequestMethod;
  path: string;
  pathParams?: object;
  headers?: object;
  queryParams?: object;
  graphQL?: GraphQLRequest;
  body?: any;
}

export interface InteractionResponse {
  status: number;
  headers?: object;
  body?: object;
  fixedDelay?: number;
  randomDelay?: RandomDelay;
}

export interface RandomDelay {
  min: number;
  max: number;
}

export interface OnCall {
  [key: number]: InteractionResponse
}

export interface InteractionResponse {
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
  strict?: boolean;
  background?: boolean;
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
 * starts the mock server
 * @see https://pactumjs.github.io/#/mock-server
 */
export function start(): Promise<void>;
export function start(port: number): Promise<void>;

/**
 * stops the mock server
 * @see https://pactumjs.github.io/#/mock-server
 */
export function stop(): Promise<void>;

/**
 * adds a interaction
 * @see https://pactumjs.github.io/#/mock-server
 */
export function addInteraction(interaction: Interaction): string | Promise<string>;
export function addInteraction(interactions: Interaction[]): string[] | Promise<string[]>;
export function addInteraction(handler: string, data?: any): string | Promise<string>;
export function addInteraction(handlers: string[], data?: any): string[] | Promise<string[]>;
export function addInteraction(handler: Handler, data?: any): string | Promise<string>;
export function addInteraction(handlers: Handler[], data?: any): string[] | Promise<string[]>;

/**
 * returns interaction details
 * @see https://pactumjs.github.io/#/mock-server
 */
export function getInteraction(id: string): InteractionDetails | Promise<InteractionDetails>;
export function getInteraction(ids: string[]): InteractionDetails[] | Promise<InteractionDetails[]>;

/**
 * removes specified interaction from the mock server
 * @see https://pactumjs.github.io/#/mock-server
 */
export function removeInteraction(id: string): void | Promise<void>;
export function removeInteraction(ids: string[]): void | Promise<void>;

/**
 * clears all interactions from the server
 * @see https://pactumjs.github.io/#/mock-server
 */
export function clearInteractions(): void;

/**
 * use remote pactum server
 * all methods in mock will return promises
 * @see https://pactumjs.github.io/#/mock-server
 */
export function useRemoteServer(url: string): void;