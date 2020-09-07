interface StateHandlerContext {
  data?: any;
  spec?: object;
}

type expectHandlerFunction = (req: object, res: object) => void;
type retryHandlerFunction = (req: object, res: object) => boolean;
type returnHandlerFunction = (req: object, res: object) => any;
type stateHandlerFunction = (ctx: StateHandlerContext) => any;

class handler {

  /**
   * adds a custom expect handler
   */
  addExpectHandler(name: string, func: expectHandlerFunction): void;

  /**
   * adds a custom retry handler
   */
  addRetryHandler(name: string, func: retryHandlerFunction): void;

  /**
   * adds a custom return handler
   */
  addReturnHandler(name: string, func: returnHandlerFunction): void;

  /**
   * adds a custom state handler
   */
  addStateHandler(name: string, func: stateHandlerFunction): void;

}

interface BasicInteraction {
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

type RequestMethod = 'GET'|'POST'|'PUT'|'DELETE'|'PATCH'|'HEAD';

interface GraphQLRequest {
  query: string;
  variables?: string;
}

interface PactInteractionRequest {
  method: RequestMethod;
  path: string;
  headers?: object;
  query?: object;
  graphQL?: GraphQLRequest;
  body?: any;
}

interface MockInteractionRequest extends PactInteractionRequest {
  /** ignores query while matching this interaction */
  ignoreQuery: boolean;
  /** ignores body while matching this interaction */
  ignoreBody: boolean;
}

interface PactInteractionResponse {
  status: number;
  headers?: object;
  body?: object; 
}

interface RandomDelay {
  min: number;
  max: number;
}

interface MockInteractionResponseWithDelay extends PactInteractionResponse {
  fixedDelay?: number;
  randomDelay?: RandomDelay;
}

interface OnCall {
  [key: number]: MockInteractionResponseWithDelay
}

interface MockInteractionResponse extends MockInteractionResponseWithDelay {
  onCall?: OnCall
}

interface MockInteraction {
  id?: string;
  provider?: string;
  withRequest: MockInteractionRequest;
  willRespondWith: MockInteractionResponse;
}

interface PactInteraction {
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

class mock {
  
  /**
   * starts the mock server on port 9393
   */
  start(): Promise<void>;

  /**
   * starts the mock server on specified port
   * @example
   * await mock.start(3000);
   */
  start(port: number): Promise<void>;

  /**
   * stops the mock server
   */
  stop(): Promise<void>;

  /**
   * adds a basic mock interaction
   * @returns interaction id
   * @example
   * mock.addInteraction({
   *  get: '/api/users',
   *  return: []
   * });
   */
  addInteraction(interaction: BasicInteraction): string;

  /**
   * adds basic mock interactions
   * @returns interaction ids
   */
  addInteractions(interactions: BasicInteraction[]): string[];

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
  addMockInteraction(interaction: MockInteraction): string;

  // TODO - accept function - (req, res)

  /**
   * adds mock interactions
   * @returns interaction ids
   */
  addMockInteractions(interaction: MockInteraction[]): string[];

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
  addPactInteraction(interaction: PactInteraction): string;

  /**
   * adds pact interactions used for contract testing
   * @returns interaction ids
   */
  addPactInteractions(interactions: PactInteraction[]): string[];

  /**
   * removes specified interaction from the mock server
   * @param id interaction id
   */
  removeInteraction(id: string): void;

  /**
   * clears all interactions from the server
   */
  clearInteractions(): void;

  /**
   * returns true if specified interaction is exercised
   * @param id interaction id
   */
  isInteractionExercised(id: string): boolean;

  /**
   * returns the number of time the interaction is used
   * @param id interaction id
   */
  getInteractionCallCount(id: string): number;
}

interface PublishOptions {
  pactFilesOrDirs?: string[];
  pactBroker?: string;
  pactBrokerUsername?: string;
  pactBrokerPassword?: string;
  consumerVersion: string;
  tags?: string[];
}

class pact {

  /**
   * @env PACT_DIR
   * 
   * sets directory for saving pact files
   * @default './pacts/'
   */
  setPactFilesDirectory(dir: string): void;

  /**
   * @env PACT_CONSUMER_NAME
   * 
   * sets the name of the consumer
   */
  setConsumerName(name: string): void

  /**
   * saves contracts in local system
   */
  save(): void;

  /**
   * publishes pact files to pact broker
   */
  publish(options: PublishOptions): Promise<void>;

}

interface StateHandler {
  [x: string]: () => {}
}

interface ProviderOptions {
  providerBaseUrl: string;
  provider: string;
  /** provider version, required to publish verification results to pact broker */
  providerVersion?: string;
  /** provider state handlers. A map of 'string -> () => Promise' */
  stateHandlers?: StateHandler;
  /** Custom Header(s) added to all request played against provider */
  customProviderHeaders?: object;
  pactFilesOrDirs?: string[];
  pactBrokerUrl?: string;
  pactBrokerUsername?: string;
  pactBrokerPassword?: string;
  pactBrokerToken?: string;
  publishVerificationResult?: boolean;
}

class provider {
  /**
   * runs provider verification
   */
  validate(options: ProviderOptions): void;
}

declare namespace pactum {
  const handler: handler;
  const mock: mock;
  const pact: pact;
  const provider: provider;
}

export = pactum;