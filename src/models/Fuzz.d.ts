import { Interaction } from '../exports/mock';

declare class Fuzz {
  /**
   * run fuzz testing on swagger url
   * @see https://pactumjs.github.io/#/fuzz-testing
   */
  onSwagger(url: string): Fuzz;

  /**
   * attaches headers to all the requests
   * @see https://pactumjs.github.io/#/fuzz-testing
   */
  withHeaders(key: string, value: any): Fuzz;
  withHeaders(headers: object): Fuzz;

  /**
   * adds a mock interaction to the server & auto removed after execution
   * @see https://pactumjs.github.io/#/fuzz-testing
   */
  useInteraction(interaction: Interaction): Fuzz;
  useInteraction(handler: string, data?: any): Fuzz;

  /**
   * number of requests to sent in each batch
   * @default 10
   * @see https://pactumjs.github.io/#/fuzz-testing
   */
  withBatchSize(size: number): Fuzz;

  /**
   * prints request & responses
   */
  inspect(): Fuzz;

  /**
   * executes the fuzz test
   */
  toss(): Promise<void>;
}

declare namespace Fuzz {}

export = Fuzz;