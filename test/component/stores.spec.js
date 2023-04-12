const pactum = require('../../src/index');
const stash = require('../../src/exports/stash');
const { addInteractionHandler } = pactum.handler;

describe('Stores', () => {

  before(() => {
    addInteractionHandler('get stores', () => {
      return {
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
      };
    });
    addInteractionHandler('post stores', () => {
      return {
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
      };
    });
    addInteractionHandler('post stores with id', () => {
      return {
        request: {
          method: 'POST',
          path: '/api/stores/1'
        },
        response: {
          status: 200
        }
      };
    });
  });

  it('store single value', async () => {
    await pactum.spec()
      .useInteraction('get stores')
      .get('http://localhost:9393/api/stores')
      .expectStatus(200)
      .stores('UserId', 'id');
    await pactum.spec()
      .useInteraction('post stores')
      .post('http://localhost:9393/api/stores')
      .withJson({
        UserId: '$S{UserId}'
      })
      .expectStatus(200);
    await pactum.spec()
      .useInteraction('post stores with id')
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

  it ('store single value by custom function', async () => {
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
      .stores((request, response) => {
        return {
            custom_func_id: response.body.id
        };
      });
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
        UserId: '$S{custom_func_id}'
      })
      .expectStatus(200);
  });

  it ('store multiple value by custom function', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/stores'
        },
        response: {
          status: 200,
          body: {
            id: 1,
            email: 'test@gmail.com'
          }
        }
      })
      .get('http://localhost:9393/api/stores')
      .expectStatus(200)
      .stores((request, response) => {
        return {
            custom_func_id: response.body.id,
            custom_func_email: response.body.email
        };
      });
      await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/stores',
          body: {
            UserId: 1,
            UserEmail: 'test@gmail.com'
          }
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/stores')
      .withJson({
        UserId: '$S{custom_func_id}',
        UserEmail: '$S{custom_func_email}'
      })
      .expectStatus(200);
  });

  it('store single value after response', async () => {
    const spec = pactum.spec();
    await spec
      .useInteraction('get stores')
      .get('http://localhost:9393/api/stores')
      .expectStatus(200);
    spec.stores('UserId', 'id');
    await pactum.spec()
      .useInteraction('post stores')
      .post('http://localhost:9393/api/stores')
      .withJson({
        UserId: '$S{UserId}'
      })
      .expectStatus(200);
    await pactum.spec()
      .useInteraction('post stores with id')
      .post('http://localhost:9393/api/stores/$S{UserId}')
      .expectStatus(200);
  });

  it('store single value after response by custom function', async () => {
    const spec = pactum.spec();
    await spec
      .useInteraction('get stores')
      .get('http://localhost:9393/api/stores')
      .expectStatus(200);
    spec.stores((request, response) => {
        return {
            UserId: response.body.id
        };
    });
    await pactum.spec()
      .useInteraction('post stores')
      .post('http://localhost:9393/api/stores')
      .withJson({
        UserId: '$S{UserId}'
      })
      .expectStatus(200);
    await pactum.spec()
      .useInteraction('post stores with id')
      .post('http://localhost:9393/api/stores/$S{UserId}')
      .expectStatus(200);
  });

  afterEach(() => {
    stash.clearDataStores();
  });

});