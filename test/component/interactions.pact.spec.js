const expect = require('chai').expect;
const pactum = require('../../src/index');

describe('Pact Interactions - Query', () => {

  it('additional actual query params with like', async () => {
    let err;
    try {
      await pactum.spec()
        .usePactInteraction({
          provider: 'pact-test-provider',
          state: 'when there is a project with id 1',
          uponReceiving: 'a request for project 1',
          withRequest: {
            method: 'GET',
            path: '/api/projects',
            query: {
              id: 1
            }
          },
          willRespondWith: {
            status: 200,
            headers: {
              'content-type': 'application/json'
            },
            body: {
              id: 1,
              name: 'fake'
            }
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