const pactum = require('../../src/index');
const expect = require('chai').expect;

describe('pactum', () => {

  it('clone', () => {
    const actual = pactum.clone({ a: 'b' });
    expect(actual).deep.equals({ a: 'b'});
  });

  it('clone - importing as a function', () => {
    const { clone } = pactum;
    const actual = clone({ a: 'b' });
    expect(actual).deep.equals({ a: 'b'});
  });

  it('sleep', async () => {
    await pactum.sleep(1);
  });

  it('sleep - importing as a function', async () => {
    const { sleep } = pactum;
    await sleep(1);
  });

});