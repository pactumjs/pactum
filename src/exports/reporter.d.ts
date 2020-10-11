export interface Reporter {
  name: string;
  afterSpec(): void;
  afterStep(): void;
  afterTest(): void;
}

export function add(reporter: Reporter): void;

export function enableJsonReporter(): void;