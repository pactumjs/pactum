const { spec, handler } = require('../../src');
const expect = require('chai').expect;

describe('Memo', () => {

  before(() => {
    handler.addSpecHandler('default get memo', ({ spec }) => {
      spec.useInteraction('default get');
      spec.get('http://localhost:9393/default/get');
      spec.expectStatus(200);
    });
    handler.addSpecHandler('default get memo duplicate', ({ spec }) => {
      spec.useInteraction('default get');
      spec.get('http://localhost:9393/default/get');
      spec.expectStatus(200);
    });
  });

  it('should memoize with boolean', async () => {
    let response = await spec('default get memo', null, { memo: true }).returns('method');
    expect(response).equals('GET')
    response = await spec('default get memo', null, { memo: true }).returns('method');
    expect(response).to.be.undefined;
    response = await spec('default get memo', null, { memo: false }).returns('method');
    expect(response).equals('GET')
  });

  it('should memoize with string', async () => {
    let response = await spec('default get memo', null, { memo: 'free' }).returns('method');
    expect(response).equals('GET');
    response = await spec('default get memo', null, { memo: 'paid' }).returns('method');
    expect(response).equals('GET');
    response = await spec('default get memo', null, { memo: 'free' }).returns('method');
    expect(response).to.be.undefined;
    response = await spec('default get memo', null, { memo: 'paid' }).returns('method');
    expect(response).to.be.undefined;
  });

  it('should memoize with object with multiple specs', async () => {
    let response = await spec('default get memo', null, { memo: { plan: 'free' } }).returns('method');
    expect(response).equals('GET');
    response = await spec('default get memo', null, { memo: { plan: 'paid' } }).returns('method');
    expect(response).equals('GET');
    response = await spec('default get memo', null, { memo: { plan: 'free' } }).returns('method');
    expect(response).to.be.undefined;
    response = await spec('default get memo', null, { memo: { plan: 'paid' } }).returns('method');
    expect(response).to.be.undefined;
    response = await spec('default get memo duplicate', null, { memo: { plan: 'free' } }).returns('method');
    expect(response).equals('GET');
    response = await spec('default get memo duplicate', null, { memo: { plan: 'paid' } }).returns('method');
    expect(response).equals('GET');
    response = await spec('default get memo duplicate', null, { memo: { plan: 'free' } }).returns('method');
    expect(response).to.be.undefined;
    response = await spec('default get memo duplicate', null, { memo: { plan: 'paid' } }).returns('method');
    expect(response).to.be.undefined;
  });

});