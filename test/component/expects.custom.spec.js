const { spec } = require('../../src');
const assert = require('assert');
const expect = require('chai').expect;

describe('Expects - Custom', () => {

  it('custom expect handler - fails', async () => {
    let err;
    try {
      await spec()
        .useInteraction('default get')
        .get('http://localhost:9393/default/get')
        .expect((_) => { assert.fail('error'); })
        .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`error`);
  });

  it('custom expect handler - bdd - fails', async () => {
    let err;
    try {
      const _spec = spec();
      await _spec
        .useInteraction('default get')
        .get('http://localhost:9393/default/get')
        .expectStatus(200);
      await _spec.response().to.have._((_) => {
        assert.fail('error');
      });
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`error`);
  });
})