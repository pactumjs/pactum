import Step from './Step';

declare class E2E {
  step(name: string): Step;
  cleanup(): Promise<void>;
}

declare namespace E2E {}

export = E2E;