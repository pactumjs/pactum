const expect = require('chai').expect;

const Spec = require('../../src/models/Spec');

describe('Spec', () => {

  it('setState - undefined', () => {
    let err;
    try {
      const spec = new Spec();
      spec.setState();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid custom state handler name provided');
  });

  it('withQueryParams - empty key', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withQueryParams('');
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: `key` is required');
  });

  it('withQueryParams - no value', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withQueryParams('some');
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: `value` is required');
  });

  it('withQueryParams - no value', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withQueryParams('some', null);
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: `value` is required');
  });

  it('withQueryParams - null', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec
        .post('/')
        .withQueryParams(null);
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: `params` are required');
  });

  it('withQueryParams - undefined', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec
        .post('/')
        .withQueryParams(undefined);
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: `params` are required');
  });

  it('empty query params object in request', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec
        .post('/')
        .withQueryParams({});
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: `params` are required');
  });

  it('withGraphQLQuery - invalid', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withGraphQLQuery();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid graphQL query - undefined');
  });

  it('withGraphQLQuery - null', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withGraphQLQuery(null);
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid graphQL query - null');
  });

  it('withGraphQLVariables - invalid', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withGraphQLVariables();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid graphQL variables - undefined');
  });

  it('withGraphQLVariables - null', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withGraphQLVariables(null);
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid graphQL variables - null');
  });

  it('withJson - invalid', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withJson();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid json in request - undefined');
  });

  it('withHeaders - invalid', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withHeaders();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: `headers` are required');
  });

  it('withHeaders - null', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withHeaders(null);
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: `headers` are required');
  });

  it('withBody - duplicate', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withBody('Hello');
      spec.withBody();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Duplicate body in request - Hello');
  });

  it('toss - without url', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec.toss();
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

  it('invalid url', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec.get();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid request url - undefined');
  });

  it('invalid url', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec.get();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid request url - undefined');
  });

  it('empty request url', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec.get('');
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid request url - ');
  });

  it('duplicate request', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec.get('/api').post('/');
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Duplicate request initiated. Existing request - GET /api');
  });

  it('null form request', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec
        .post('/')
        .withForm(null);
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid form provided - null');
  });

  it('duplicate form request', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec
        .post('/')
        .withForm({})
        .withForm({});
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Duplicate form in request');
  });

  it('invalid request timeout', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec
        .post('/')
        .withRequestTimeout("1000");
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid timeout provided - 1000');
  });

  it('empty retry options', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec
        .post('/')
        .retry();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid retry options');
  });

  it('empty retry strategy', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec
        .post('/')
        .retry({});
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid retry strategy');
  });

  it('response() called before toss()', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec
        .post('/')
        .response();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals(`Error: 'response()' should be called after resolving 'toss()'`);
  });

});