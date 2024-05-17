const { like } = require('pactum-matchers');
const pactum = require('../../src/index');
const { handler, expect, settings } = pactum;
const ce = require('chai').expect;

describe('BDD', () => {

  const spec = pactum.spec();
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
        headers: {
          'set-cookie': 'name=snow'
        },
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
    expect(response).to.have.header('connection', /\w+/);
    expect(response).to.have.headerContains('connection', 'l');
  });

  it('should return cookies', () => {
    expect(response).to.have.cookiesLike('name', 'snow');
    expect(response).to.have.cookies('name', 'snow');
  });

  it('should return a valid user', async () => {
    expect(response).to.have.json({ name: 'snow' });
    expect(response).should.have.jsonLike({ name: 'snow' });
    expect(response).to.have.json('name', 'snow');
    expect(response).to.have.jsonLike('name', 'snow');
    expect(response).to.have.body({ name: 'snow' });
    spec.response().to.have.bodyContains(`snow`);
  });

  it('should return a valid schema', async () => {
    expect(response).to.have.jsonSchema({ properties: { name: { type: 'string' } } });
  });

  it('should return a valid schema with options', async () => {
    expect(response).to.have.jsonSchema(
      {
        properties: {
          name: {
            type: 'string',
            format: 'only-snow'
          }
        }
      },
      {
        formats: {
          'only-snow': /^snow$/
        }
      }
    );
  });

  it('should return a valid schema at', async () => {
    expect(response).to.have.jsonSchema('.', { properties: { name: { type: 'string' } } });
  });

  it('should return a valid schema at with options', async () => {
    expect(response).to.have.jsonSchema('.',
      { properties: { name: { type: 'string', format: 'only-snow' } } },
      {
        formats: {
          'only-snow': /^snow$/
        }
      }
    );
  });

  it('should return a match', async () => {
    expect(response).to.have.jsonMatch(like({ name: 'snow' }));
  });

  it('should return a match at', async () => {
    expect(response).to.have.jsonMatch('.', like({ name: 'snow' }));
  });

  it('should return a strict match', async () => {
    expect(response).to.have.jsonMatchStrict(like({ name: 'snow' }));
  });

  it('should return a strict match at', async () => {
    expect(response).to.have.jsonMatchStrict('.', like({ name: 'snow' }));
  });

  it('should return a response within 500 ms', async () => {
    expect(response).to.have.responseTimeLessThan(1500);
    let err;
    try {
      expect(response).to.have.responseTimeLessThan(0);
    } catch (error) {
      err = error;
    }
    ce(err).not.undefined;
    try {
      spec.response().to.have.responseTimeLessThan(0);
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

  it('should not have a json with length', async () => {
    let err;
    try {
      await expect(response).to.have.jsonLength(1);
    } catch (error) {
      err = error;
    }
    ce(err).not.undefined;
  });

  it('should not have a json with length at some path', async () => {
    let err;
    try {
      await expect(response).to.have.jsonLength('path', 1);
    } catch (error) {
      err = error;
    }
    ce(err).not.undefined;
  });

  it('Should sleep after spec', async () => {
    const spec = pactum.spec();
    spec.useInteraction('default get');
    await spec.get('http://localhost:9393/default/get').expectStatus(200).sleep(2000).toss();
  });

});

describe('BDD - AutoReportRunner Disabled', () => {

  before(() => {
    settings.setReporterAutoRun(false);
    this.spec = pactum.spec();
    this.spec.useInteraction('default get');
  });

  it('get default', () => {
    this.spec.get('http://localhost:9393/default/get');
  });

  it('should return a response', async () => {
    await this.spec.toss();
  });

  it('should return a status 200', () => {
    this.spec.response().to.have.status(200);
  });

  it('should not return an error', async () => {
    let err;
    try {
      this.spec.response().should.have.error();
    } catch (error) {
      err = error;
    }
    ce(err).not.undefined;
  });

  after(() => {
    this.spec.end();
    settings.setReporterAutoRun(true);
  });

});