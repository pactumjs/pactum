import * as Spec from './models/Spec';
import * as Fuzz from './models/Fuzz';
import * as E2E from './models/E2E';

export * as expect from './exports/expect';
export * as handler from './exports/handler';
export * as matchers from './exports/matcher';
export * as mock from './exports/mock';
export * as reporter from './exports/reporter';
export * as request from './exports/request';
export * as response from './exports/response';
export * as settings from './exports/settings';
export * as stash from './exports/stash';
export * as state from './exports/state';
export * as logger from './exports/logger';

/**
 * returns an instance of a spec
 * @example
 * await pactum.spec()
 *  .get('/api/users')
 *  .expectStatus(200);
 */
export function spec(): Spec;

/**
 * returns an instance of a spec & runs custom spec handler
 * @example
 * await pactum.spec()
 *  .use('spec handler name', { optional: 'data' })
 *  .expectStatus(200);
 */
export function spec(name: string, data?: any): Spec;

/**
 * returns an instance of spec
 * @param name - unique pactum flow name
 */
export function flow(name: string): Spec;

export function fuzz(): Fuzz;

export function e2e(name: string): E2E;

export function sleep(ms: number): Promise<void>;

export namespace pactum { }