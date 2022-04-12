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

  it('getStashKey - returns the key as a stash key', () => {
    const { getStashKey } = pactum;
    expect(getStashKey('stash-key'), '$S{stash-key}');
  });
  it('getMapKey - returns the key as a map key', () => {
    const { getMapKey } = pactum;
    expect(getMapKey('map-key'), '$M{map-key}');
  });
  it('getFunctionKey - returns the key as a function key', () => {
    const { getFunctionKey } = pactum;
    expect(getFunctionKey('function-key'), '$S{function-key}');
  });


});