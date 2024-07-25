const { expect } = require('../../src');
const Expect = require('../../src/models/expect');
const ce = require('chai').expect;

describe('Expect', () => {

  it('validate status', () => {
    const ex = new Expect();
    ex._validateStatus({});
  });

  it('validate headers', () => {
    const ex = new Expect();
    ex.headers.push({key: 'c', value: undefined });
    ex._validateHeaders({ headers: { c: 'ss'}});
  });

});

describe('expect', () => {

  it('empty objects', () => {
    expect({}).to.have.jsonLike({});
  });

  it('objects with properties', () => {
    expect({ name: 'mom' }).to.have.jsonLike({ name: 'mom' });
  });

  it('objects with extra properties in actual json', () => {
    expect({ name: 'mom', age: 50 }).to.have.jsonLike({ name: 'mom' });
  });

  it('objects with different properties', () => {
    let err;
    try {
      expect({ name: 'mom' }).to.have.jsonLike({ role: 'mom' });
    } catch (error) {
      err = error;
    }
    ce(err.message).equals(`Json doesn't have property 'role' at '$'`);
  });
});