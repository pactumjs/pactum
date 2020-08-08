const expect = require('chai').expect;

const Spec = require('../../src/models/Spec');

describe('Spec', () => {

  it('withQuery - invalid', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withQuery();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid key in query parameter for request - undefined');
  });

  it('withQuery - empty key', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withQuery('');
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid key in query parameter for request - ');
  });

  it('withQuery - null key', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withQuery(null);
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid key in query parameter for request - null');
  });

  it('withQuery - no value', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withQuery('some');
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid value in query parameter for request - undefined');
  });

  it('withQuery - no value', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withQuery('some', null);
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid value in query parameter for request - null');
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
    expect(err.toString()).equals('Error: Invalid headers in request - undefined');
  });

  it('withHeaders - null', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withHeaders(null);
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid headers in request - null');
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

  it('null query params in request', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec
        .post('/')
        .withQueryParams(null);
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid query parameters for request - null');
  });

  it('duplicate query params in request', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec
        .post('/')
        .withQueryParams({})
        .withQueryParams({});
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Duplicate query params in request');
  });

  it('invalid request timeout', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec
        .post('/')
        .__setRequestTimeout("1000");
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid timeout provided - 1000');
  });

  it('valid request', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec.get('http://localhost:3000');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
  });

});