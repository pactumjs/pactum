const expect = require('chai').expect;
const handler = require('../../src/exports/handler');

describe('Handler', () => {

  it('invalid handler name', () => {
    let err;
    try {
      handler.addCustomExpectHandler();
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Invalid custom expect handler name');
  });

  it('empty handler name', () => {
    let err;
    try {
      handler.addCustomExpectHandler('');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Invalid custom expect handler name');
  });

  it('invalid handler function', () => {
    let err;
    try {
      handler.addCustomExpectHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Custom expect handler should be a function');
  });

});