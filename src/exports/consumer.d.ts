export interface PublishOptions {
  pactFilesOrDirs?: string[];
  pactBrokerUrl?: string;
  pactBrokerUsername?: string;
  pactBrokerPassword?: string;
  consumerVersion: string;
  tags?: string[];
}

/**
 * @env PACT_DIR
 * 
 * sets directory for saving pact files
 * @default './pacts/'
 */
export function setPactFilesDirectory(dir: string): void;

/**
 * @env PACT_CONSUMER_NAME
 * 
 * sets the name of the consumer
 */
export function setConsumerName(name: string): void

/**
 * saves contracts in local system
 */
export function save(): void;

/**
 * publishes pact files to pact broker
 */
export function publish(options: PublishOptions): Promise<void>;