const expect = require('chai').expect;
const handler = require('../../src/exports/handler');

describe('Expect Handler', () => {

  it('invalid handler name', () => {
    let err;
    try {
      handler.addExpectHandler();
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Invalid custom expect handler name');
  });

  it('empty handler name', () => {
    let err;
    try {
      handler.addExpectHandler('');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Invalid custom expect handler name');
  });

  it('invalid handler function', () => {
    let err;
    try {
      handler.addExpectHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Custom expect handler should be a function');
  });

});

describe('Retry Handler', () => {

  it('invalid handler name', () => {
    let err;
    try {
      handler.addRetryHandler();
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Invalid retry handler name');
  });

  it('empty handler name', () => {
    let err;
    try {
      handler.addRetryHandler('');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Invalid retry handler name');
  });

  it('invalid handler function', () => {
    let err;
    try {
      handler.addRetryHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Retry handler should be a function');
  });

});