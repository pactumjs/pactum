const expect = require('chai').expect;

const Spec = require('../../src/models/spec');

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

  it('withFormData - invalid', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withFormData();
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Invalid form data in request - undefined');
  });

  it('withFormData - duplicate', () => {
    let err;
    try {
      const spec = new Spec();
      spec.withFormData({});
      spec.withFormData({});
    } catch (error) {
      err = error;
    }
    expect(err.toString()).equals('Error: Duplicate form data in request - [object FormData]');
  });

  it('toss - without url', async () => {
    let err;
    try {
      const spec = new Spec();
      await spec.toss();
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


});