const pactum = require('../../src/index');
const stash = require('../../src/exports/stash');

describe('Stores', () => {

  it('store single value', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/stores'
        },
        response: {
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
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/stores',
          body: {
            UserId: 1
          }
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/stores')
      .withJson({
        UserId: '$S{UserId}'
      })
      .expectStatus(200);
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/stores/1'
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/stores/$S{UserId}')
      .expectStatus(200);
  });

  it('store multiple value', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/stores'
        },
        response: {
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
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/stores',
          body: {
            UserId: 1
          }
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/stores')
      .withJson({
        UserId: '$S{FirstUser.id}'
      })
      .expectStatus(200);
  });

  it('invalid spec reference', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/stores',
          body: {
            UserId: '$S{Unknown}'
          }
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/stores')
      .withJson({
        UserId: '$S{Unknown}'
      })
      .expectStatus(200);
  });

  it('store single value - capture handlers', async () => {
    pactum.handler.addCaptureHandler('GetID', ({ res }) => res.json.id);
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/stores'
        },
        response: {
          status: 200,
          body: {
            id: 1
          }
        }
      })
      .get('http://localhost:9393/api/stores')
      .expectStatus(200)
      .stores('CapturedUserId', '#GetID');
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/stores',
          body: {
            UserId: 1
          }
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/stores')
      .withJson({
        UserId: '$S{CapturedUserId}'
      })
      .expectStatus(200);
  });

  afterEach(() => {
    stash.clearDataStores();
  });

});