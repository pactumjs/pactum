export interface SpecRequest {
  method: string;
  path: string;
  headers?: object;
  body?: any;
}

export interface SpecResponse {
  statusCode: number;
  headers: object;
  body?: any;
}

export interface SpecData {
  id: string;
  status: string;
  failure: string;
  start: string;
  end: string;
  duration: number;
  request: SpecRequest;
  response?: SpecResponse;
  recorded?: any;
}

export interface Reporter {
  name: string;
  afterSpec(data: SpecData): void;
  afterStep(data: object): void;
  afterTest(data: object): void;
}

export function add(reporter: Reporter): void;

export function enableJsonReporter(dir?: string, file?: string): void;