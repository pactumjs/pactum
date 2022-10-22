import { InteractionRequest, Interaction } from './mock';

export interface SpecRequest {
  method: string;
  url: string;
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

export interface InteractionCall {
  request: InteractionRequest;
  exercisedAt: string;
}

export interface ExercisedInteraction extends Interaction {
  calls: InteractionCall[];
}

export interface SpecData {
  id: string;
  flow?: string;
  name?: string;
  status: string;
  failure: string;
  start: string;
  end: string;
  request: SpecRequest;
  response?: SpecResponse;
  recorded?: object;
  interactions: ExercisedInteraction[];
}

export interface Reporter {
  name?: string;
  afterSpec?(data: SpecData): void;
  afterStep?(data: object): void;
  afterTest?(data: object): void;
  afterInteraction?(data: ExercisedInteraction): void;
  end?(): void | Promise<void>
}

/**
 * adds custom reporters
 * @see https://pactumjs.github.io/guides/reporting.html
 */
export function add(reporter: Reporter): void;

/**
 * runs end function of all added reporters
 * @see https://pactumjs.github.io/guides/reporting.html
 */
export function end(): Promise<void>;
