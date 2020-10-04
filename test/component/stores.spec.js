const pactum = require('../../src/index');
const stash = require('../../src/exports/stash');

describe('Stores', () => {

  it('store single value', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/stores'
        },
        willRespondWith: {
          status: 200,
          body: {
            id: 1
          }
        }
      })
      .get('http://localhost:9393/api/stores')
      .expectStatus(200)
      .stores('UserId', 'id');
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/stores',
          body: {
            UserId: 1
          }
        },
        willRespondWith: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/stores')
      .withJson({
        UserId: '@DATA:SPEC::UserId@'
      })
      .expectStatus(200);
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/stores/1'
        },
        willRespondWith: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/stores/@DATA:SPEC::UserId@')
      .expectStatus(200);
  });

  it('store multiple value', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/stores'
        },
        willRespondWith: {
          status: 200,
          body: [
            {
              id: 1,
              name: 'Jon'
            },
            {
              id: 2,
              name: 'Snow'
            }
          ]
        }
      })
      .get('http://localhost:9393/api/stores')
      .expectStatus(200)
      .stores('FirstUser', '[0]')
      .stores('SecondUser', '[1]');
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/stores',
          body: {
            UserId: 1
          }
        },
        willRespondWith: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/stores')
      .withJson({
        UserId: '@DATA:SPEC::FirstUser.id@'
      })
      .expectStatus(200);
  });

  it('invalid spec reference', async () => {
    await pactum.spec()
      .useMockInteraction({
        withRequest: {
          method: 'POST',
          path: '/api/stores',
          body: {
            UserId: '@DATA:SPEC::Unknown@'
          }
        },
        willRespondWith: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/stores')
      .withJson({
        UserId: '@DATA:SPEC::Unknown@'
      })
      .expectStatus(200);
  });

  afterEach(() => {
    stash.clearDataSpecs();
  });

});