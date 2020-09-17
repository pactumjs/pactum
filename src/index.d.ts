import * as Spec from './models/Spec';

export * as consumer from './exports/consumer';
export * as expect from './exports/expect';
export * as handler from './exports/handler';
export * as matchers from './exports/matcher';
export * as mock from './exports/mock';
export * as provider from './exports/provider';
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

export namespace pactum { }