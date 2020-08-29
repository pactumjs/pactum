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
    expect(err.message).equals('Invalid custom retry handler name');
  });

  it('empty handler name', () => {
    let err;
    try {
      handler.addRetryHandler('');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Invalid custom retry handler name');
  });

  it('invalid handler function', () => {
    let err;
    try {
      handler.addRetryHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Custom retry handler should be a function');
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
    expect(err.message).equals('Invalid custom return handler name');
  });

  it('empty handler name', () => {
    let err;
    try {
      handler.addReturnHandler('');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Invalid custom return handler name');
  });

  it('invalid handler function', () => {
    let err;
    try {
      handler.addReturnHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Custom return handler should be a function');
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
    expect(err.message).equals('Invalid custom state handler name');
  });

  it('empty handler name', () => {
    let err;
    try {
      handler.addStateHandler('');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Invalid custom state handler name');
  });

  it('invalid handler function', () => {
    let err;
    try {
      handler.addStateHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Custom state handler should be a function');
  });

});