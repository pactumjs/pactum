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
      handler.addCaptureHandler();
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`name` is required');
  });

  it('empty handler name', () => {
    let err;
    try {
      handler.addCaptureHandler('');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`name` is required');
  });

  it('invalid handler function', () => {
    let err;
    try {
      handler.addCaptureHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`func` is required');
  });

  it('get invalid handler function', () => {
    let err;
    try {
      handler.getCaptureHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Capture Handler Not Found - 'hello'`);
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

describe('Data Handler', () => {

  it('invalid handler name', () => {
    let err;
    try {
      handler.addDataFuncHandler();
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`name` is required');
  });

  it('empty handler name', () => {
    let err;
    try {
      handler.addDataFuncHandler('');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`name` is required');
  });

  it('invalid handler function', () => {
    let err;
    try {
      handler.addDataFuncHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`func` is required');
  });

  it('get invalid handler function', () => {
    let err;
    try {
      handler.getDataFuncHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Data Handler Not Found - 'hello'`);
  });

});

describe('Interaction Handler', () => {

  it('invalid handler name', () => {
    let err;
    try {
      handler.addInteractionHandler();
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`name` is required');
  });

  it('empty handler name', () => {
    let err;
    try {
      handler.addInteractionHandler('');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`name` is required');
  });

  it('invalid handler function', () => {
    let err;
    try {
      handler.addInteractionHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`func` is required');
  });

  it('get invalid handler function', () => {
    let err;
    try {
      handler.getInteractionHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Interaction Handler Not Found - 'hello'`);
  });

});

describe('Spec Handler', () => {

  it('invalid handler name', () => {
    let err;
    try {
      handler.addSpecHandler();
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`name` is required');
  });

  it('empty handler name', () => {
    let err;
    try {
      handler.addSpecHandler('');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`name` is required');
  });

  it('invalid handler function', () => {
    let err;
    try {
      handler.addSpecHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('`func` is required');
  });

  it('get invalid handler function', () => {
    let err;
    try {
      handler.getSpecHandler('hello');
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`Spec Handler Not Found - 'hello'`);
  });

});