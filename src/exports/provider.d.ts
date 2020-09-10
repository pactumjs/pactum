export interface ProviderOptions {
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

/**
 * runs provider verification
 */
export function validate(options: ProviderOptions): Promise<void>;