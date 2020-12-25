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

// describe('Remote- post single pact interaction', () => {

//   let id;

//   before(async () => {
//     id = await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pactInteractions')
//       .withJson([{
//         provider: 'big',
//         state: 'liquid',
//         uponReceiving: 'vapour',
//         request: {
//           method: 'GET',
//           path: '/api/projects/1'
//         },
//         response: {
//           status: 200,
//           headers: {
//             'content-type': 'application/json'
//           },
//           body: {
//             id: 1,
//             name: 'fake'
//           }
//         }
//       }])
//       .expectStatus(200)
//       .expectJsonLike([/\w+/])
//       .returns('[0]');
//   });

//   it('get all pact interactions', async () => {
//     await pactum.spec()
//       .get('http://localhost:9393/api/pactum/pactInteractions')
//       .expectStatus(200)
//       .expectJsonLike([{
//         id: /\w+/,
//         callCount: 0,
//         provider: 'big',
//         state: 'liquid',
//         uponReceiving: 'vapour',
//         response: {
//           body: {
//             id: 1,
//             name: 'fake'
//           },
//           headers: {
//             'content-type': 'application/json'
//           },
//           status: 200
//         },
//         request: {
//           method: 'GET',
//           path: '/api/projects/1'
//         },
//         expects: { exercised: true }
//       }])
//       .toss();
//   });

//   it('get single pact interaction', async () => {
//     await pactum.spec()
//       .get(`http://localhost:9393/api/pactum/pactInteractions?ids=${id}`)
//       .expectStatus(200)
//       .expectJsonLike([{
//         id: /\w+/,
//         callCount: 0,
//         provider: 'big',
//         state: 'liquid',
//         uponReceiving: 'vapour',
//         response: {
//           body: {
//             id: 1,
//             name: 'fake'
//           },
//           headers: {
//             'content-type': 'application/json'
//           },
//           status: 200
//         },
//         request: {
//           method: 'GET',
//           path: '/api/projects/1'
//         },
//         expects: { exercised: true }
//       }])
//       .toss();
//   });

//   it('exercise single pact interaction', async () => {
//     await pactum.spec()
//       .get(`http://localhost:9393/api/projects/1`)
//       .expectStatus(200)
//       .expectJson({
//         id: 1,
//         name: 'fake'
//       })
//       .toss();
//   });

//   it('exercise single pact interaction - second iteration', async () => {
//     await pactum.spec()
//       .get(`http://localhost:9393/api/projects/1`)
//       .expectStatus(200)
//       .expectJson({
//         id: 1,
//         name: 'fake'
//       })
//       .toss();
//   });

//   it('save pacts invalid method', async () => {
//     await pactum.spec()
//       .get(`http://localhost:9393/api/pactum/pacts/save`)
//       .expectStatus(405);
//   });

//   it('save pacts', async () => {
//     await pactum.spec()
//       .post(`http://localhost:9393/api/pactum/pacts/save`)
//       .expectStatus(200);
//   });

//   after(async () => {
//     await pactum.spec()
//       .delete(`http://localhost:9393/api/pactum/pactInteractions?ids=${id}`)
//       .expectStatus(200)
//       .toss();
//   });

// });

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

// describe('Remote - Save Pacts', () => {

//   it('save interactions - not exercised', async () => {
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pactInteractions')
//       .withJson([{
//         provider: 'remote',
//         state: 'liquid',
//         uponReceiving: 'vapour',
//         request: {
//           method: 'GET',
//           path: '/api/projects/1'
//         },
//         response: {
//           status: 200
//         }
//       }])
//       .expectStatus(200);
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pacts/save')
//       .expectStatus(200);
//     // validate pact files
//   });

//   it('save interactions - after one interaction exercised', async () => {
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pactInteractions')
//       .withJson([{
//         provider: 'remote',
//         state: 'liquid',
//         uponReceiving: 'vapour',
//         request: {
//           method: 'GET',
//           path: '/api/projects/1'
//         },
//         response: {
//           status: 200
//         }
//       }])
//       .expectStatus(200);
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pactInteractions')
//       .withJson([{
//         provider: 'remote',
//         state: 'solid',
//         uponReceiving: 'goods',
//         request: {
//           method: 'GET',
//           path: '/api/projects/2'
//         },
//         response: {
//           status: 200
//         }
//       }])
//       .expectStatus(200);
//     await pactum.spec()
//       .get(`http://localhost:9393/api/projects/1`)
//       .expectStatus(200);
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pacts/save')
//       .expectStatus(200);
//     // validate pact files
//   });

//   it('save interactions - all interactions exercised from single provider', async () => {
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pactInteractions')
//       .withJson([{
//         provider: 'remote',
//         state: 'liquid',
//         uponReceiving: 'vapour',
//         request: {
//           method: 'GET',
//           path: '/api/projects/1'
//         },
//         response: {
//           status: 200
//         }
//       }])
//       .expectStatus(200);
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pactInteractions')
//       .withJson([{
//         provider: 'remote',
//         state: 'solid',
//         uponReceiving: 'goods',
//         request: {
//           method: 'GET',
//           path: '/api/projects/2'
//         },
//         response: {
//           status: 200
//         }
//       }])
//       .expectStatus(200);
//     await pactum.spec()
//       .get(`http://localhost:9393/api/projects/1`)
//       .expectStatus(200);
//     await pactum.spec()
//       .get(`http://localhost:9393/api/projects/2`)
//       .expectStatus(200);
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pacts/save')
//       .expectStatus(200);
//     // validate pact files
//   });

//   it('save interactions - all interactions exercised from multiple providers', async () => {
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pactInteractions')
//       .withJson([{
//         provider: 'remote-1',
//         state: 'liquid',
//         uponReceiving: 'vapour',
//         request: {
//           method: 'GET',
//           path: '/api/projects/1'
//         },
//         response: {
//           status: 200
//         }
//       }])
//       .expectStatus(200);
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pactInteractions')
//       .withJson([{
//         provider: 'remote-2',
//         state: 'solid',
//         uponReceiving: 'goods',
//         request: {
//           method: 'GET',
//           path: '/api/projects/2'
//         },
//         response: {
//           status: 200
//         }
//       }])
//       .expectStatus(200);
//     await pactum.spec()
//       .get(`http://localhost:9393/api/projects/1`)
//       .expectStatus(200);
//     await pactum.spec()
//       .get(`http://localhost:9393/api/projects/2`)
//       .expectStatus(200);
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pacts/save')
//       .expectStatus(200);
//     // validate pact files
//   });

//   afterEach(() => {
//     store.pacts.clear();
//     store.interactionExerciseCounter.clear();
//     mock.clearInteractions();
//   });

// });

// describe('Remote - Publish Pacts', () => {

//   it('publish interactions - not exercised', async () => {
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pactInteractions')
//       .withJson([{
//         provider: 'remote',
//         state: 'liquid',
//         uponReceiving: 'vapour',
//         request: {
//           method: 'GET',
//           path: '/api/projects/1'
//         },
//         response: {
//           status: 200
//         }
//       }])
//       .expectStatus(200);
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pacts/publish')
//       .withJson({
//         pactBrokerUrl: 'http://localhost:9393',
//         consumerVersion: '1.2.3',
//         pactBrokerUsername: 'user',
//         pactBrokerPassword: 'pass'
//       })
//       .expectStatus(200);
//   });

//   it('publish interactions - all interactions exercised from multiple providers', async () => {
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pactInteractions')
//       .withJson([{
//         provider: 'remote-1',
//         state: 'liquid',
//         uponReceiving: 'vapour',
//         request: {
//           method: 'GET',
//           path: '/api/projects/1'
//         },
//         response: {
//           status: 200
//         }
//       }])
//       .expectStatus(200);
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pactInteractions')
//       .withJson([{
//         provider: 'remote-2',
//         state: 'solid',
//         uponReceiving: 'goods',
//         request: {
//           method: 'GET',
//           path: '/api/projects/2'
//         },
//         response: {
//           status: 200
//         }
//       }])
//       .expectStatus(200);
//     await pactum.spec()
//       .get(`http://localhost:9393/api/projects/1`)
//       .expectStatus(200);
//     await pactum.spec()
//       .get(`http://localhost:9393/api/projects/2`)
//       .expectStatus(200);
//     await pactum.spec()
//       .useInteraction({
//         request: {
//           method: 'PUT',
//           path: '/pacts/provider/remote-1/consumer/consumer/version/1.2.3',
//           headers: {
//             authorization: 'Basic dXNlcjpwYXNz'
//           },
//           body: {
//             "consumer": {
//               "name": "consumer"
//             },
//             "provider": {
//               "name": "remote-1"
//             },
//             "interactions": [
//               {
//                 "description": "vapour",
//                 "providerState": "liquid",
//                 "request": {
//                   "method": "GET",
//                   "path": "/api/projects/1",
//                   "query": ""
//                 },
//                 "response": {
//                   "status": 200,
//                   "headers": {},
//                   "matchingRules": {}
//                 }
//               }
//             ],
//             "metadata": {
//               "pactSpecification": {
//                 "version": "2.0.0"
//               }
//             }
//           }
//         },
//         response: {
//           status: 200
//         }
//       })
//       .useInteraction({
//         request: {
//           method: 'PUT',
//           path: '/pacts/provider/remote-2/consumer/consumer/version/1.2.3',
//           headers: {
//             authorization: 'Basic dXNlcjpwYXNz'
//           },
//           body: {
//             "consumer": {
//               "name": "consumer"
//             },
//             "provider": {
//               "name": "remote-2"
//             },
//             "interactions": [
//               {
//                 "description": "goods",
//                 "providerState": "solid",
//                 "request": {
//                   "method": "GET",
//                   "path": "/api/projects/2",
//                   "query": ""
//                 },
//                 "response": {
//                   "status": 200,
//                   "headers": {},
//                   "matchingRules": {}
//                 }
//               }
//             ],
//             "metadata": {
//               "pactSpecification": {
//                 "version": "2.0.0"
//               }
//             }
//           }
//         },
//         response: {
//           status: 200
//         }
//       })
//       .post('http://localhost:9393/api/pactum/pacts/publish')
//       .withJson({
//         pactBrokerUrl: 'http://localhost:9393',
//         consumerVersion: '1.2.3',
//         pactBrokerUsername: 'user',
//         pactBrokerPassword: 'pass'
//       })
//       .expectStatus(200);
//   });

//   it('publish interactions - one interaction exercised with tags', async () => {
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pactInteractions')
//       .withJson([{
//         provider: 'remote-1',
//         state: 'liquid',
//         uponReceiving: 'vapour',
//         request: {
//           method: 'GET',
//           path: '/api/projects/1'
//         },
//         response: {
//           status: 200
//         }
//       }])
//       .expectStatus(200);
//     await pactum.spec()
//       .post('http://localhost:9393/api/pactum/pactInteractions')
//       .withJson([{
//         provider: 'remote-2',
//         state: 'solid',
//         uponReceiving: 'goods',
//         request: {
//           method: 'GET',
//           path: '/api/projects/2'
//         },
//         response: {
//           status: 200
//         }
//       }])
//       .expectStatus(200);
//     await pactum.spec()
//       .get(`http://localhost:9393/api/projects/1`)
//       .expectStatus(200);
//     await pactum.spec()
//       .useInteraction({
//         request: {
//           method: 'PUT',
//           path: '/pacts/provider/remote-1/consumer/consumer/version/1.2.3',
//           headers: {
//             authorization: 'Basic dXNlcjpwYXNz'
//           },
//           body: {
//             "consumer": {
//               "name": "consumer"
//             },
//             "provider": {
//               "name": "remote-1"
//             },
//             "interactions": [
//               {
//                 "description": "vapour",
//                 "providerState": "liquid",
//                 "request": {
//                   "method": "GET",
//                   "path": "/api/projects/1",
//                   "query": ""
//                 },
//                 "response": {
//                   "status": 200,
//                   "headers": {},
//                   "matchingRules": {}
//                 }
//               }
//             ],
//             "metadata": {
//               "pactSpecification": {
//                 "version": "2.0.0"
//               }
//             }
//           }
//         },
//         response: {
//           status: 200
//         }
//       })
//       .useInteraction({
//         request: {
//           method: 'PUT',
//           path: '/pacticipants/consumer/versions/1.2.3/tags/prod',
//           headers: {
//             authorization: 'Basic dXNlcjpwYXNz'
//           }
//         },
//         response: {
//           status: 200
//         }
//       })
//       .useInteraction({
//         request: {
//           method: 'PUT',
//           path: '/pacticipants/consumer/versions/1.2.3/tags/latest',
//           headers: {
//             authorization: 'Basic dXNlcjpwYXNz'
//           }
//         },
//         response: {
//           status: 200
//         }
//       })
//       .post('http://localhost:9393/api/pactum/pacts/publish')
//       .withJson({
//         pactBrokerUrl: 'http://localhost:9393',
//         consumerVersion: '1.2.3',
//         pactBrokerUsername: 'user',
//         pactBrokerPassword: 'pass',
//         tags: ['latest', 'prod']
//       })
//       .expectStatus(200);
//   });

//   afterEach(() => {
//     store.pacts.clear();
//     store.interactionExerciseCounter.clear();
//     mock.clearInteractions();
//   });

// });

describe('Remote - Health', () => {

  it('publish interactions - not exercised', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/pactum/health')
      .expectStatus(200)
      .expectBody('OK');
  });

});