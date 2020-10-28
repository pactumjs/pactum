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
  responseTime: number;
}

export interface SpecInfo {
  id: string;
  status: string;
  failure: string;
  start: string;
  end: string;
}

export interface SpecData {
  id: string;
  info: SpecInfo;
  request: SpecRequest;
  response?: SpecResponse;
  recorded?: object;
}

export interface Reporter {
  name: string;
  afterSpec(data: SpecData): void;
  afterStep(data: object): void;
  afterTest(data: object): void;
  end(): void | Promise<void>
}

export function add(reporter: Reporter): void;

/**
 * runs end function of all added reporters
 */
export function end(): Promise<void>;