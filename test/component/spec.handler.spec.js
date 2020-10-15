const pactum = require('../../src/index');
const handler = pactum.handler;

describe('Spec Handler', () => {

  before(() => {
    handler.addMockInteractionHandler('get users', () => {
      return {
        withRequest: {
          method: 'GET',
          path: '/api/users'
        },
        willRespondWith: {
          status: 200,
          body: {
            id: 1
          }
        }
      }
    });
    handler.addSpecHandler('get user', (ctx) => {
      const spec = ctx.spec;
      spec.useMockInteraction('get users');
      spec.get('http://localhost:9393/api/users');
    });
  });

  it('get user', async () => {
    await pactum
      .spec('get user')
      .expectStatus(200);
  });

});