const expect = require('chai').expect;
const pactum = require('../../src/index');
const stash = require('../../src/exports/stash');
const { addInteractionHandler } = pactum.handler;

describe('Stores', () => {

  before(() => {
    addInteractionHandler('get stores', ({ data }) => {
      return {
        request: {
          method: 'GET',
          path: '/api/stores'
        },
        response: {
          status: 200,
          body: data ? data : { id: 1 }
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
          status: 200,
          body: {
            name: 'Snow'
          }
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
          ],
          cookies: {
            token: 'xyz',
          },
        },
      })
      .get('http://localhost:9393/api/stores')
      .expectStatus(200)
      .stores('FirstUser', '[0]')
      .stores('SecondUser', '[1]')
      .stores('token', 'res.cookies.token');
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/stores',
          cookies: {
            token: 'xyz'
          },
          body: {
            UserId: 1
          }
        },
        response: {
          status: 200
        }
      })
      .post('http://localhost:9393/api/stores')
      .withCookies('token', '$S{token}')
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

  it('store single value by custom function', async () => {
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

  it('store multiple value by custom function', async () => {
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

  it('store on failure', async () => {
    await pactum.spec()
      .useInteraction('get stores')
      .get('http://localhost:9393/api/stores')
      .expectStatus(200)
      .stores('FailedUserId', 'id', { status: 'FAILED' });
    expect(stash.getDataStore('FailedUserId')).to.be.undefined;
    try {
      await pactum.spec()
        .useInteraction('get stores')
        .get('http://localhost:9393/api/stores')
        .expectStatus(500)
        .stores('FailedUserId', 'id', { status: 'FAILED' })
        .inspect(false);
    } catch (error) {

    }
    expect(stash.getDataStore('FailedUserId')).equals(1);
  });

  it('store on success', async () => {
    try {
      await pactum.spec()
        .useInteraction('get stores')
        .get('http://localhost:9393/api/stores')
        .expectStatus(500)
        .stores('FailedUserId', 'id', { status: 'PASSED' })
        .inspect(false);
    } catch (error) {

    }
    expect(stash.getDataStore('FailedUserId')).to.be.undefined;
    await pactum.spec()
      .useInteraction('get stores')
      .get('http://localhost:9393/api/stores')
      .expectStatus(200)
      .stores('FailedUserId', 'id', { status: 'PASSED' });
    expect(stash.getDataStore('FailedUserId')).equals(1);
  });

  it('store append', async () => {
    await pactum.spec()
      .useInteraction('get stores')
      .get('http://localhost:9393/api/stores')
      .expectStatus(200)
      .stores('UserId', 'id', { append: true });
    await pactum.spec()
      .useInteraction('get stores')
      .get('http://localhost:9393/api/stores')
      .expectStatus(200)
      .stores('UserId', 'id', { append: true });
    expect(stash.getDataStore('UserId')).deep.equals([1, 1]);
  });

  it('store merge', async () => {
    await pactum.spec()
      .useInteraction('get stores', { id: 1 })
      .get('http://localhost:9393/api/stores')
      .expectStatus(200)
      .stores('User', '.');
    await pactum.spec()
      .useInteraction('get stores', { name: 'Snow' })
      .get('http://localhost:9393/api/stores')
      .expectStatus(200)
      .stores('User', '.', { merge: true });
    expect(stash.getDataStore()).deep.equals({ User: { id: 1, name: 'Snow' } });
  });

  it('store merge in same request', async () => {
    await pactum.spec()
      .useInteraction('post stores')
      .post('http://localhost:9393/api/stores')
      .withJson({
        UserId: 1
      })
      .expectStatus(200)
      .stores('User', '.', { merge: true })
      .stores('User', 'req.body', { merge: true });
    expect(stash.getDataStore()).deep.equals({ User: { UserId: 1, name: 'Snow' } });
  })

  afterEach(() => {
    stash.clearDataStores();
  });

});