const expect = require('chai').expect;

const request = require('../../src/exports/request');
const config = require('../../src/config');

describe('request', () => {

  it('setBaseUrl - null', () => {
    expect(() => request.setBaseUrl(null)).throws('Invalid base url provided - null');
  });

  it('setBaseUrl - undefined', () => {
    expect(() => request.setBaseUrl()).throws('Invalid base url provided - undefined');
  });

  it('setDefaultHeader - null', () => {
    expect(() => request.setDefaultHeader(null)).throws('Invalid header key provided - null');
  });

  it('setDefaultHeader - undefined', () => {
    expect(() => request.setDefaultHeader()).throws('Invalid header key provided - undefined');
  });

  it('setDefaultHeaders - null', () => {
    expect(() => request.setDefaultHeaders(null)).throws('Invalid headers provided - null');
  });

  it('setDefaultHeader & setDefaultHeaders', () => {
    request.setDefaultHeader('hello', 'world');
    request.setDefaultHeader('no', 'space');
    request.setDefaultHeaders({
      'gta': 'v',
      'hello': 'space'
    });
    expect(config.request.headers).deep.equals({
      'hello': 'space',
      'no': 'space',
      'gta': 'v'
    });
  });

  it('setDefaultTimeout - null', () => {
    expect(() => request.setDefaultTimeout(null)).throws('Invalid timeout provided - null');
  });

  it('setDefaultTimeout - undefined', () => {
    expect(() => request.setDefaultTimeout()).throws('Invalid timeout provided - undefined');
  });

  it('setDefaultTimeout - string', () => {
    expect(() => request.setDefaultTimeout('100')).throws('Invalid timeout provided - 100');
  });

  afterEach(() => {
   config.request.headers = {}; 
  });

});