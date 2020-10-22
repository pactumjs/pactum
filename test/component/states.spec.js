const pactum = require('../../src/index');
const handler = require('../../src/exports/handler');
const state = require('../../src/exports/state');
const mock = require('../../src/exports/mock');
const expect = require('chai').expect;

describe('State', () => {

  before(() => {
    handler.addStateHandler('there is a project with id', (ctx) => {
      const spec = ctx.spec;
      const id = ctx.data;
      spec.useMockInteraction({
        withRequest: {
          method: 'GET',
          path: `/api/projects/${id}`
        },
        willRespondWith: {
          status: 200,
          body: { id }
        }
      });
    });
    handler.addStateHandler('there is a user with id', (ctx) => {
      mock.addMockInteraction({
        withRequest: {
          method: 'GET',
          path: `/api/users/${ctx.data}`
        },
        willRespondWith: {
          status: 200
        }
      })
    })
  });

  it('using a single sate in multiple specs', async () => {
    await pactum.spec()
      .setState('there is a project with id', 99)
      .get('http://localhost:9393/api/projects/99')
      .expectJson({
        id: 99
      });
    await pactum.spec()
      .setState('there is a project with id', 98)
      .get('http://localhost:9393/api/projects/98')
      .expectJson({
        id: 98
      });
    await pactum.spec()
      .get('http://localhost:9393/api/projects/99')
      .expectStatus(404);
  });

  it('state not found', async () => {
    let err;
    try {
      await pactum.spec()
      .setState('invalid state')
      .get('http://localhost:9393/api/projects/98')
      .expectJson({
        id: 98
      });  
    } catch (error) {
      err = error;
    }
    expect(err.message).equals(`State Handler Not Found - 'invalid state'`);
  });

  it('set state from state object', async () => {
    await state.set('there is a user with id', 10);
    await pactum.spec()
      .get('http://localhost:9393/api/users/10')
      .expectStatus(200);
  });

});