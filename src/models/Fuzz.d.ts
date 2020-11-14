declare class Fuzz {
  swagger(url: string): Fuzz;
  toss(): Promise<void>;
}

declare namespace Fuzz {}

export = Fuzz;