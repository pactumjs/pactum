const pactum = require('../../src/index');
const handler = pactum.handler;

describe('Spec Handler', () => {

  before(() => {
    handler.addInteractionHandler('get users', () => {
      return {
        request: {
          method: 'GET',
          path: '/api/users'
        },
        response: {
          status: 200,
          body: [
            {
              id: 1
            },
            {
              id: 2
            }
          ]
        }
      };
    });
    handler.addInteractionHandler('get user one', () => {
      return {
        request: {
          method: 'GET',
          path: '/api/users/1'
        },
        response: {
          status: 200,
          body: {
            id: 1
          }
        }
      };
    });
    handler.addSpecHandler('get users', (ctx) => {
      const spec = ctx.spec;
      spec.useInteraction('get users');
      spec.get('http://localhost:9393/api/users');
    });
    handler.addSpecHandler('get user', (ctx) => {
      const spec = ctx.spec;
      spec.useInteraction('get user one');
      spec.get('http://localhost:9393/api/users' + `/${ctx.data}`);
    });
  });

  it('get users', async () => {
    await pactum
      .spec('get users')
      .expectStatus(200)
      .expectJson([
        {
          id: 1
        },
        {
          id: 2
        }
      ]);
  });

  it('get user one', async () => {
    await pactum
      .spec('get user', 1)
      .expectStatus(200)
      .expectJson({
        id: 1
      });
  });

  it('get user one - use', async () => {
    await pactum
      .spec()
      .use('get user', 1)
      .expectStatus(200)
      .expectJson({
        id: 1
      });
  });

  it('sleep in spec handler', async () => {
    await pactum
      .spec('get users')
      .expectStatus(200)
      .expectJson([
        {
          id: 1
        },
        {
          id: 2
        }
      ])
      .sleep(10);
  });
});