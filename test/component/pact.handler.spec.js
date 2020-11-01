const pactum = require('../../src/index');
const handler = pactum.handler;

describe('Pact Interactions - Handler', () => {

  before(() => {

    handler.addPactInteractionHandler('get project', (ctx) => {
      return {
        provider: 'test-provider',
        state: 'when there is a project with id 1',
        uponReceiving: 'a request for project 1',
        withRequest: {
          method: 'GET',
          path: `/api/projects/${ctx.data}`
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: ctx.data,
            name: 'fake'
          }
        }
      }
    });
    handler.addPactInteractionHandler('get project with id 1', (ctx) => {
      return { name: 'get project', data: 1 };
    });
  });

  it('GET - handler name & custom data', async () => {
    await pactum.spec()
      .usePactInteraction('get project with id 1')
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200);
  });

});