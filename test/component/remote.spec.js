const pactum = require('../../src/index');
const mock = require('../../src/exports/mock');
const helper = require('../../src/helpers/helper');
const sandbox = require('sinon').createSandbox();

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

  it('publish interactions - not exercised', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/pactum/health')
      .expectStatus(200)
      .expectBody('OK');
  });

});