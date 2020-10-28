import * as Spec from './models/Spec';
import * as E2E from './models/E2E';

export * as consumer from './exports/consumer';
export * as expect from './exports/expect';
export * as handler from './exports/handler';
export * as matchers from './exports/matcher';
export * as mock from './exports/mock';
export * as provider from './exports/provider';
export * as reporter from './exports/reporter';
export * as request from './exports/request';
export * as settings from './exports/settings';
export * as stash from './exports/stash';
export * as state from './exports/state';

/**
 * returns an instance of a spec
 * @example
 * await pactum.spec()
 *  .get('/api/users')
 *  .expectStatus(200);
 */
export function spec(): Spec;
/**
 * @param ctx - test runner context
 */
export function spec(ctx?: object): Spec;
/**
 * @param name - spec handler name
 * @param data - custom data
 */
export function spec(name: string, data?: any): Spec;

export function e2e(name: string): E2E;

export namespace pactum { }