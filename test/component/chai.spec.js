const { like } = require('pactum-matchers');
const pactum = require('../../src/index');
const handler = pactum.handler;
const expect = pactum.expect;
const ce = require('chai').expect;

describe('Chai Like Assertions', () => {

  let spec = pactum.spec();
  let response;

  before(() => {
    handler.addExpectHandler('a user', (ctx) => {
      const res = ctx.res;
      expect(res).should.have.status(200);
    });
    handler.addExpectHandler('a status 200', (ctx) => {
      const res = ctx.res;
      expect(res).should.have.status(200);
    });
    handler.addExpectHandler('a status 400', (ctx) => {
      const res = ctx.res;
      expect(res).should.have.status(400);
    });
  });

  it('Given a user with name snow', () => {
    spec.useInteraction({
      request: {
        method: 'GET',
        path: '/api/users'
      },
      response: {
        status: 200,
        body: {
          name: 'snow'
        }
      }
    });
  });

  it('When a user is requested', () => {
    spec.get('http://localhost:9393/api/users');
  });

  it('should return a response', async () => {
    response = await spec.toss();
  });

  it('should return a status 200', () => {
    expect(response).to.have.status(200);
  });

  it('should return a header', () => {
    expect(response).to.have.header('connection', 'close');
    expect(response).to.have.headerContains('connection', 'cl');
  });

  it('should return a valid user', async () => {
    expect(response).to.have.json({ name: 'snow' });
    expect(response).should.have.jsonLike({ name: 'snow' });
    expect(response).to.have.jsonAt('name', 'snow');
    expect(response).to.have.jsonLikeAt('name', 'snow');
    expect(response).to.have.body(`{"name":"snow"}`);
    spec.response().to.have.bodyContains(`snow`);
  });

  it('should return a valid schema', async () => {
    expect(response).to.have.jsonSchema({ properties: { name: { type: 'string' } } });
  });

  it('should return a valid schema at', async () => {
    expect(response).to.have.jsonSchemaAt('.', { properties: { name: { type: 'string' } } });
  });

  it('should return a match', async () => {
    expect(response).to.have.jsonMatch(like({ name: 'snow' }));
  });

  it('should return a match at', async () => {
    expect(response).to.have.jsonMatchAt('.', like({ name: 'snow' }));
  });

  it('should return a response within 500 ms', async () => {
    expect(response).to.have.responseTimeLessThan(500);
    let err;
    try {
      expect(response).to.have.responseTimeLessThan(0);
    } catch (error) {
      err = error;
    }
    ce(err).not.undefined;
  });

  it('should run a custom expect handler', async () => {
    let err;
    await expect(response).to.have._('a user');
    await expect(response).to.have._('a status 200');
    try {
      await expect(response).to.have._('a status 400');
    } catch (error) {
      err = error;
    }
    ce(err).not.undefined;
  });

  it('should return custom data', async () => {
    ce(spec.returns('name')).equals('snow');
  });

});