export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'TRACE';

export interface GraphQLRequest {
  query: string;
  variables?: object;
}

export interface CommonInteractionRequest {
  method?: RequestMethod;
  path?: string;
  headers?: object;
  body?: any;
}

export interface InteractionRequest extends CommonInteractionRequest {
  method: RequestMethod;
  path: string;
  pathParams?: object;
  cookies?: object;
  queryParams?: object;
  graphQL?: GraphQLRequest;
  form?: object;
}

export interface InteractionResponse {
  status: number;
  headers?: object;
  cookies?: object;
  body?: any;
  file?: string;
  fixedDelay?: number;
  randomDelay?: RandomDelay;
  onCall?: OnCall;
}

export interface RandomDelay {
  min: number;
  max: number;
}

export interface OnCall {
  [key: number]: InteractionResponse
}

export interface InteractionExpectations {
  disable?: boolean;
  exercised?: boolean;
  callCount?: number;
}

export interface InteractionCallRequest extends CommonInteractionRequest {
  query?: { [key: string]: unknown };
  headers?: { [key: string]: unknown };
  body?: { [key: string]: unknown } | string;
}

export interface CommonInteractionCall {
  request?: CommonInteractionRequest;
  exercisedAt: number | string;
}

export interface InteractionCall extends CommonInteractionCall {
  exercisedAt: number;
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
  clone?: boolean;
  request: InteractionRequest;
  response: InteractionResponse;
  expects?: InteractionExpectations;
  stores?: object;
  calls?: CommonInteractionCall[];
}

export interface InteractionDetails extends Interaction {
  exercised?: boolean;
  callCount?: number;
}

export interface Handler {
  name: string;
  data?: any;
}

export interface HttpsOpts {
  key?: string;
  cert?: string;
}

export interface MockServerOptions {
  port?: number;
  host?: string;
  httpOpts?: HttpsOpts;
}

/**
 * starts the mock server
 * @see https://pactumjs.github.io/guides/mock-server.html
 */
export function start(): Promise<void>;
export function start(port: number): Promise<void>;
export function start(port: number, host: string): Promise<void>;

/**
 * stops the mock server
 * @see https://pactumjs.github.io/guides/mock-server.html
 */
export function stop(): Promise<void>;

/**
 * sets default configuration for mock server
 * @see https://pactumjs.github.io/guides/mock-server.html
 * @see https://pactumjs.github.io/api/mock/setDefaults.html
 */
export function setDefaults(options: MockServerOptions): Promise<void>;

/**
 * adds a interaction
 * @see https://pactumjs.github.io/guides/mock-server.html
 * @see https://pactumjs.github.io/api/mock/interaction.html
 */
export function addInteraction(interaction: Interaction): string | Promise<string>;
export function addInteraction(interactions: Interaction[]): string[] | Promise<string[]>;
export function addInteraction(handler: string, data?: any): string | Promise<string>;
export function addInteraction(handlers: string[], data?: any): string[] | Promise<string[]>;
export function addInteraction(handler: Handler, data?: any): string | Promise<string>;
export function addInteraction(handlers: Handler[], data?: any): string[] | Promise<string[]>;

/**
 * returns interaction details
 * @see https://pactumjs.github.io/guides/mock-server.html
 */
export function getInteraction(id: string): InteractionDetails | Promise<InteractionDetails>;
export function getInteraction(ids: string[]): InteractionDetails[] | Promise<InteractionDetails[]>;

/**
 * removes specified interaction from the mock server
 * @see https://pactumjs.github.io/guides/mock-server.html
 */
export function removeInteraction(id: string): void | Promise<void>;
export function removeInteraction(ids: string[]): void | Promise<void>;

/**
 * clears all interactions from the server
 * @see https://pactumjs.github.io/guides/mock-server.html
 */
export function clearInteractions(): void;

/**
 * use remote pactum server
 * all methods in mock will return promises
 * @see https://pactumjs.github.io/guides/mock-server.html
 */
export function useRemoteServer(url: string): void;