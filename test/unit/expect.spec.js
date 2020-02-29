const Expect = require('../../src/models/expect');

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