const expect = require('chai').expect;

const response = require('../../src/exports/response');
const config = require('../../src/config');

describe('response', () => {

  it('setDefaultExpectHeaders - null', () => {
    expect(() => response.setDefaultExpectHeaders(null)).throws('Invalid expected response header key provided - null');
  });

  it('setDefaultExpectHeaders - undefined', () => {
    expect(() => response.setDefaultExpectHeaders()).throws('Invalid expected response header key provided - undefined');
  });

  it('removeDefaultExpectHeader - undefined', () => {
    expect(() => response.removeDefaultExpectHeader()).throws('Invalid expected response header key provided - undefined');
  });

  it('setDefaultHeader & setDefaultHeaders & remove', () => {
    response.setDefaultExpectHeaders('hello', 'world');
    response.setDefaultExpectHeaders('no', 'space');
    response.setDefaultExpectHeaders({
      'gta': 'v',
      'hello': 'space'
    });
    expect(config.response.headers).deep.equals({
      'hello': 'space',
      'no': 'space',
      'gta': 'v'
    });
    response.removeDefaultExpectHeader('no');
    expect(config.response.headers).deep.equals({
      'hello': 'space',
      'gta': 'v'
    });
    response.removeDefaultExpectHeaders();
    expect(config.response.headers).deep.equals({});
  });

  it('setDefaultExpectResponseTime - null', () => {
    expect(() => response.setDefaultExpectResponseTime(null)).throws('Invalid expected response time provided - null');
  });

  it('setDefaultExpectResponseTime - undefined', () => {
    expect(() => response.setDefaultExpectResponseTime()).throws('Invalid expected response time provided - undefined');
  });

  it('setDefaultExpectResponseTime - string', () => {
    expect(() => response.setDefaultExpectResponseTime('1000')).throws('Invalid expected response time provided - 1000');
  });

  it('setDefaultExpectResponseTime - Valid value', () => {
    response.setDefaultExpectResponseTime(1000);
    expect(config.response.time).deep.equals(1000);
  });

  it('setDefaultExpectStatus - null', () => {
    expect(() => response.setDefaultExpectStatus(null)).throws('Invalid expected response status provided - null');
  });

  it('setDefaultExpectStatus - undefined', () => {
    expect(() => response.setDefaultExpectStatus()).throws('Invalid expected response status provided - undefined');
  });

  it('setDefaultExpectStatus - string', () => {
    expect(() => response.setDefaultExpectStatus('1000')).throws('Invalid expected response status provided - 1000');
  });

  it('setDefaultExpectStatus - 800', () => {
    expect(() => response.setDefaultExpectStatus(800)).throws('Invalid expected response status provided - 800');
  });

  it('setDefaultExpectStatus - Valid value', () => {
    response.setDefaultExpectStatus(200);
    expect(config.response.status).deep.equals(200);
  });

  afterEach(() => {
    config.response.headers = {};
    config.response.time = null;
    config.response.status = null;
  });

});