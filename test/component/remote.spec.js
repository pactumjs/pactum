const pactum = require('../../src/index');
const mock = require('../../src/exports/mock');
const helper = require('../../src/helpers/helper');
const sandbox = require('sinon').createSandbox();
const { handler } = pactum;

describe('Remote- post single mock interaction', () => {

  let id;

  before(async () => {
    sandbox.stub(helper, 'getCurrentTime').returns("123456");
    mock.clearInteractions();
    id = await pactum.spec()
      .post('http://localhost:9393/api/pactum/interactions')
      .withJson([{
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
        }
      }])
      .expectStatus(200)
      .expectJsonLike([/\w+/])
      .returns('[0]');
  });

  it('get all mock interactions', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/pactum/interactions')
      .expectStatus(200)
      .expectJson([
        {
          "callCount": 0,
          "exercised": false,
          "calls": [],
          id,
          "strict": true,
          "request": {
            "matchingRules": {},
            "method": "GET",
            "path": "/api/projects/1",
            "queryParams": {}
          },
          "response": {
            "matchingRules": {},
            "status": 200,
            "headers": {
              "content-type": "application/json"
            },
            "body": {
              "id": 1,
              "name": "fake"
            }
          },
          "expects": {
            "exercised": true
          }
        }
      ])
      .toss();
  });

  it('get single mock interaction', async () => {
    await pactum.spec()
      .get(`http://localhost:9393/api/pactum/interactions?ids=${id}`)
      .expectStatus(200)
      .expectJson([
        {
          "callCount": 0,
          "exercised": false,
          "calls": [],
          id,
          "strict": true,
          "request": {
            "matchingRules": {},
            "method": "GET",
            "path": "/api/projects/1",
            "queryParams": {}
          },
          "response": {
            "matchingRules": {},
            "status": 200,
            "headers": {
              "content-type": "application/json"
            },
            "body": {
              "id": 1,
              "name": "fake"
            }
          },
          "expects": {
            "exercised": true
          }
        }
      ])
      .toss();
  });

  it('exercise single mock interaction', async () => {
    await pactum.spec()
      .get(`http://localhost:9393/api/projects/1`)
      .expectStatus(200)
      .expectJson({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('get single mock interaction after exercise', async () => {
    await pactum.spec()
      .get(`http://localhost:9393/api/pactum/interactions?ids=${id}`)
      .expectStatus(200)
      .expectJson([
        {
          "callCount": 1,
          "exercised": true,
          "calls": [
            {
              "request": {
                "method": "GET",
                "path": "/api/projects/1",
                "query": {},
                "headers": {
                  "host": "localhost:9393",
                  "connection": "close"
                },
                "body": ""
              },
              "exercisedAt": "123456"
            }
          ],
          id,
          "strict": true,
          "request": {
            "matchingRules": {},
            "method": "GET",
            "path": "/api/projects/1",
            "queryParams": {}
          },
          "response": {
            "matchingRules": {},
            "status": 200,
            "headers": {
              "content-type": "application/json"
            },
            "body": {
              "id": 1,
              "name": "fake"
            }
          },
          "expects": {
            "exercised": true
          }
        }
      ])
      .toss();
  });

  after(async () => {
    sandbox.restore();
    await pactum.spec()
      .delete(`http://localhost:9393/api/pactum/interactions?ids=${id}`)
      .expectStatus(200)
      .toss();
  });

});

describe('Remote- invalid requests', () => {

  it('invalid url', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/pactum/invalid')
      .expectStatus(404)
      .expectBodyContains('404 Not Found')
      .toss();
  });

  it('invalid method', async () => {
    await pactum.spec()
      .patch('http://localhost:9393/api/pactum/interactions')
      .expectStatus(405)
      .toss();
  });

});

describe('Remote - Health', () => {

  it('get health', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/pactum/health')
      .expectStatus(200)
      .expectBody('OK');
  });

});

describe('Remote - Reporter', () => {

  it('reporter end - no reporters', async () => {
    await pactum.spec()
      .post('http://localhost:9393/api/pactum/reporter/end')
      .expectStatus(200);
  });

  it('reporter end - with reporter fails', async () => {
    pactum.reporter.add({
      end() {
        throw 'Some Error';
      }
    });
    await pactum.spec()
      .post('http://localhost:9393/api/pactum/reporter/end')
      .expectStatus(500);
    pactum.reporter.get().length = 0;
  });

});

describe('Remote - State', () => {

  before(() => {
    handler.addStateHandler('abc', () => { });
    handler.addStateHandler('fail', ({ data }) => { if (data) throw 'abc'; });
  });

  it('post empty data', async () => {
    await pactum.spec()
      .post('http://localhost:9393/api/pactum/state')
      .expectStatus(200);
  });

  it('post with one invalid handler name should fail', async () => {
    await pactum.spec()
      .post('http://localhost:9393/api/pactum/state')
      .withJson([
        {
          name: 'xyz'
        }
      ])
      .expectStatus(400);
  });

  it('post with one handler name should pass', async () => {
    await pactum.spec()
      .post('http://localhost:9393/api/pactum/state')
      .withJson([
        {
          name: 'abc'
        }
      ])
      .expectStatus(200);
  });

  it('post with one handler name fails to run', async () => {
    await pactum.spec()
      .post('http://localhost:9393/api/pactum/state')
      .withJson([
        {
          name: 'fail',
          data: true
        }
      ])
      .expectStatus(400);
  });

});