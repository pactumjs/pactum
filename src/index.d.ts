import * as Spec from './models/Spec';
import * as Fuzz from './models/Fuzz';
import * as E2E from './models/E2E';

import expect from './exports/expect';
export { expect };

export * as handler from './exports/handler';
export * as mock from './exports/mock';
export * as reporter from './exports/reporter';
export * as request from './exports/request';
export * as response from './exports/response';
export * as settings from './exports/settings';
export * as stash from './exports/stash';
export * as state from './exports/state';

/**
 * returns an instance of a spec
 * @see https://pactumjs.github.io/api/requests/spec.html
 */
export function spec(): Spec;

/**
 * returns an instance of a spec & runs custom spec handler
 * @see https://pactumjs.github.io/api/requests/spec.html
 */
export function spec<T = any>(name: string, data?: T): Spec;

/**
 * returns an instance of spec
 * @see https://pactumjs.github.io/api/requests/flow.html
 */
export function flow(name: string): Spec;

export function fuzz(): Fuzz;

export function e2e(name: string): E2E;

/**
 * @see https://pactumjs.github.io/api/utils/sleep.html
 */
export function sleep(ms: number): Promise<void>;

/**
 * @see https://pactumjs.github.io/api/utils/clone.html
 */
export function clone<T>(input: T): T;

/**
 * @see https://pactumjs.github.io/api/utils/parse.html
 */
export function parse(data: any): any;

export namespace pactum { }