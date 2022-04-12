import Spec from './Spec';

declare class CleanStep extends Spec {}

declare class StepSpec extends Spec {
  clean(name?: string, data?: any): CleanStep;
}

declare class Step {
  spec<T = any>(name?: string, data?: T): StepSpec;
  clean(name?: string, data?: any): CleanStep;
  toss(): Promise<void>;
}

declare namespace Step {}

export = Step;