const pactum = require('../../src/index');
const handler = pactum.handler;

describe('Mock Interactions - Handler', () => {

  before(() => {
    handler.addMockInteractionHandler('get projects', () => {
      return {
        withRequest: {
          method: 'GET',
          path: '/api/projects'
        },
        willRespondWith: {
          status: 200
        }
      }
    });
    handler.addMockInteractionHandler('get project', (ctx) => {
      return {
        withRequest: {
          method: 'GET',
          path: `/api/projects/${ctx.data}`
        },
        willRespondWith: {
          status: 200
        }
      }
    });
    handler.addMockInteractionHandler('get parent', (ctx) => {
      return {
        withRequest: {
          method: 'GET',
          path: `/api/parent/${ctx.data}`
        },
        willRespondWith: {
          status: 200
        }
      }
    });
    handler.addMockInteractionHandler('get child', (ctx) => {
      return {
        name: 'get parent',
        data: ctx.data || 'child'
      }
    });
    handler.addMockInteractionHandler('get sub child', () => {
      return {
        name: 'get child',
        data: 'child/sub'
      }
    });
  });

  it('GET - with handler name', async () => {
    await pactum.spec()
      .useMockInteraction('get projects')
      .get('http://localhost:9393/api/projects')
      .expectStatus(200);
  });

  it('GET - handler name & custom data', async () => {
    await pactum.spec()
      .useMockInteraction('get project', 1)
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200);
  });

  it('GET - child handler', async () => {
    await pactum.spec()
      .useMockInteraction('get child')
      .get('http://localhost:9393/api/parent/child')
      .expectStatus(200);
  });

  it('GET - sub child handler', async () => {
    await pactum.spec()
      .useMockInteraction('get sub child')
      .get('http://localhost:9393/api/parent/child/sub')
      .expectStatus(200);
  });

});
