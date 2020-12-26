const expect = require('chai').expect;
const pactum = require('../../src/index');

describe('Interactions - Strict - Query', () => {

  it('additional actual query params', async () => {
    let err;
    try {
      await pactum.spec()
        .useInteraction({
          request: {
            method: 'GET',
            path: '/api/projects',
            queryParams: {
              id: 1
            }
          },
          response: {
            status: 200
          }
        })
        .get('http://localhost:9393/api/projects')
        .withQueryParams('id', 1)
        .withQueryParams('name', 'snow')
        .expectStatus(200);
    } catch (error) {
      err = error;
    }
    expect(err).not.to.be.undefined;
  });

});