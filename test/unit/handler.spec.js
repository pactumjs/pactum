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
    expect(err.message).equals('`name` is required');
  });

  it('empty handler name', () => {
    let err;
    try {
      handler.addExpectHandler('');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`name` is required');
  });

  it('invalid handler function', () => {
    let err;
    try {
      handler.addExpectHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`func` is required');
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
    expect(err.message).equals('`name` is required');
  });

  it('empty handler name', () => {
    let err;
    try {
      handler.addRetryHandler('');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`name` is required');
  });

  it('invalid handler function', () => {
    let err;
    try {
      handler.addRetryHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`func` is required');
  });

});

describe('Return Handler', () => {

  it('invalid handler name', () => {
    let err;
    try {
      handler.addReturnHandler();
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`name` is required');
  });

  it('empty handler name', () => {
    let err;
    try {
      handler.addReturnHandler('');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`name` is required');
  });

  it('invalid handler function', () => {
    let err;
    try {
      handler.addReturnHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`func` is required');
  });

});

describe('State Handler', () => {

  it('invalid handler name', () => {
    let err;
    try {
      handler.addStateHandler();
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`name` is required');
  });

  it('empty handler name', () => {
    let err;
    try {
      handler.addStateHandler('');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`name` is required');
  });

  it('invalid handler function', () => {
    let err;
    try {
      handler.addStateHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`func` is required');
  });

});