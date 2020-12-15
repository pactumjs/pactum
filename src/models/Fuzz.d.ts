import { MockInteraction } from '../exports/mock';

declare class Fuzz {
  /**
   * run fuzz testing on swagger url
   * @example
   * await pactum.fuzz()
   *  .onSwagger('/api/swagger.json');
   */
  onSwagger(url: string): Fuzz;

  /**
   * attaches headers to all the requests
   * @example
   * await pactum.fuzz()
   *  .onSwagger('/api/swagger.json')
   *  .withHeaders('Authorization', 'Basic xxx')
   *  .withHeaders({
   *    'content-type': 'application/json'
   *  });
   */
  withHeaders(key: string, value: any): Fuzz;
  withHeaders(headers: object): Fuzz;

  /**
   * adds a mock interaction to the server & auto removed after execution
   * @example
   * await pactum.fuzz()
   *  .useMockInteraction('handler name')
   *  .onSwagger('/api/swagger.json');
   */
  useMockInteraction(interaction: MockInteraction): Fuzz;
  useMockInteraction(handler: string, data?: any): Fuzz;

  /**
   * number of requests to sent in each batch
   * @default 10
   * @example
   * await pactum.fuzz()
   *  .onSwagger('/api/swagger.json') 
   *  .withBatchSize(15);
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