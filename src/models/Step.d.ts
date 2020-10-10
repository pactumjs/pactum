import Spec from './Spec';

declare class CleanStep extends Spec {}

declare class StepSpec extends Spec {
  clean(name?: string, data?: any): CleanStep;
}

declare class Step {
  spec(name?: string, data?: any): StepSpec;
}

declare namespace Step {}

export = Step;