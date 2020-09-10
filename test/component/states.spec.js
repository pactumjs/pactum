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
      spec.useInteraction({
        get: `/api/projects/${id}`,
        return: { id }
      });
    });
    handler.addStateHandler('there is a user with id', (ctx) => {
      mock.addInteraction({
        get: `/api/users/${ctx.data}`
      })
    })
  });

  it('using a single sate in multiple specs', async () => {
    await pactum
      .setState('there is a project with id', 99)
      .get('http://localhost:9393/api/projects/99')
      .expectJson({
        id: 99
      });
    await pactum
      .setState('there is a project with id', 98)
      .get('http://localhost:9393/api/projects/98')
      .expectJson({
        id: 98
      });
    await pactum
      .get('http://localhost:9393/api/projects/99')
      .expectStatus(404);
  });

  it('state not found', async () => {
    let err;
    try {
      await pactum
      .setState('invalid state')
      .get('http://localhost:9393/api/projects/98')
      .expectJson({
        id: 98
      });  
    } catch (error) {
      err = error;
    }
    expect(err.message).equals('Custom State Handler Not Found - invalid state');
  });

  it('set state from state object', async () => {
    await state.set('there is a user with id', 10);
    await pactum
      .get('http://localhost:9393/api/users/10')
      .expectStatus(200);
  });

});