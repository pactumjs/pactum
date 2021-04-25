const mock = require('../../src/exports/mock');
const pactum = require('../../src/index');
const handler = pactum.handler;

describe('Mock Interactions - Handler', () => {

  before(() => {
    handler.addInteractionHandler('get projects', () => {
      return {
        request: {
          method: 'GET',
          path: '/api/projects'
        },
        response: {
          status: 200
        }
      };
    });
    handler.addInteractionHandler('get project', (ctx) => {
      return {
        request: {
          method: 'GET',
          path: `/api/projects/${ctx.data}`
        },
        response: {
          status: 200
        }
      };
    });
    handler.addInteractionHandler('get parent', (ctx) => {
      return {
        request: {
          method: 'GET',
          path: `/api/parent/${ctx.data}`
        },
        response: {
          status: 200
        }
      };
    });
    handler.addInteractionHandler('get child', (ctx) => {
      return {
        name: 'get parent',
        data: ctx.data || 'child'
      };
    });
    handler.addInteractionHandler('get sub child', () => {
      return {
        name: 'get child',
        data: 'child/sub'
      };
    });
    handler.addInteractionHandler('get sub child', () => {
      return {
        name: 'get child',
        data: 'child/sub'
      };
    });
    handler.addInteractionHandler('get users with id 1 & 2', (ctx) => {
      return [
      {
        request: {
          method: 'GET',
          path: `/api/users/${ctx.data[0]}`
        },
        response: {
          status: 200
        }
      },
      {
        request: {
          method: 'GET',
          path: `/api/users/${ctx.data[1]}`
        },
        response: {
          status: 200
        }
      }];
    });
  });

  it('GET - with handler name', async () => {
    await pactum.spec()
      .useInteraction('get projects')
      .get('http://localhost:9393/api/projects')
      .expectStatus(200);
  });

  it('GET - handler name & custom data', async () => {
    await pactum.spec()
      .useInteraction('get project', 1)
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200);
  });

  it('GET - child handler', async () => {
    await pactum.spec()
      .useInteraction('get child')
      .get('http://localhost:9393/api/parent/child')
      .expectStatus(200);
  });

  it('GET - sub child handler', async () => {
    await pactum.spec()
      .useInteraction('get sub child')
      .get('http://localhost:9393/api/parent/child/sub')
      .expectStatus(200);
  });

  it('GET - handler name & custom data by default mock', async () => {
    mock.addInteraction({ name: 'get project', data: 1});
    await pactum.spec()
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200);
    mock.clearInteractions();
  });

  it('GET - multiple interactions', async () => {
    const specWait = pactum.spec()
    .get('http://localhost:9393/api/users/1')
    .expectStatus(200)
    await pactum.spec()
      .useInteraction('get users with id 1 & 2', [1, 2])
      .get('http://localhost:9393/api/users/2')
      .expectStatus(200)
      .wait(specWait);
    mock.clearInteractions();
  });

});
