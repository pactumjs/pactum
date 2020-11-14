declare class Fuzz {
  /**
   * run fuzz testing on swagger url
   * @example
   * await pactum.fuzz()
   *  .onSwagger('/api/swagger.json');
   */
  onSwagger(url: string): Fuzz;

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