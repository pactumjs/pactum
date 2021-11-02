const mock = require('../../src/exports/mock');
const pactum = require('../../src/index');
const { like } = require('pactum-matchers');

describe('Interaction', () => {

  it('Stores - Path Params', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/{id}',
          pathParams: {
            id: '101'
          }
        },
        response: {
          status: 200,
          body: {
            id: '$S{ProjectId}'
          }
        },
        stores: {
          ProjectId: 'req.pathParams.id'
        }
      })
      .get('http://localhost:9393/api/projects/101')
      .expectStatus(200)
      .expectJson({
        id: '101'
      });
  });

  it('Stores - Query Params', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects',
          queryParams: {
            id: '102'
          }
        },
        response: {
          status: 200,
          body: {
            id: '$S{ProjectId}'
          }
        },
        stores: {
          ProjectId: 'req.queryParams.id'
        }
      })
      .get('http://localhost:9393/api/projects')
      .withQueryParams('id', '102')
      .expectStatus(200)
      .expectJson({
        id: '102'
      });
  });

  it('Stores - Headers', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects'
        },
        response: {
          status: 200,
          body: {
            token: '$S{Token}'
          }
        },
        stores: {
          Token: 'req.headers.token'
        }
      })
      .get('http://localhost:9393/api/projects')
      .withHeaders('token', 'xyz')
      .expectStatus(200)
      .expectJson({
        token: 'xyz'
      });
  });

  it('Stores - Body', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/projects',
          body: {
            name: 'abc'
          }
        },
        response: {
          status: 200,
          body: {
            name: '$S{Name}'
          }
        },
        stores: {
          Name: 'req.body.name'
        }
      })
      .post('http://localhost:9393/api/projects')
      .withJson({
        'name': 'abc'
      })
      .expectStatus(200)
      .expectJson({
        name: 'abc'
      });
  });

  it('Stores - Multiple', async () => {
    pactum.handler.addCaptureHandler('GetID', ({ req }) => req.body.id);
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'POST',
          path: '/api/projects',
          body: {
            id: 'id2',
            name: 'abc2'
          }
        },
        response: {
          status: 200,
          body: {
            id: '$S{Id}',
            name: '$S{Name}',
            token: '$S{Token}'
          }
        },
        stores: {
          Id: '#GetID',
          Name: 'req.body.name',
          Token: 'req.headers.token'
        }
      })
      .post('http://localhost:9393/api/projects')
      .withHeaders('token', 'xyz2')
      .withJson({
        'id': 'id2',
        'name': 'abc2'
      })
      .expectStatus(200)
      .expectJson({
        id: 'id2',
        name: 'abc2',
        token: 'xyz2'
      });
  });

  it('Stores - Duplicates', async () => {
    mock.addInteraction({
      id: 'stores-duplicate',
      request: {
        method: 'POST',
        path: '/api/stores/duplicate',
        body: like({
          id: 1
        })
      },
      stores: {
        id: 'req.body.id'
      },
      response: {
        status: 200,
        body: {
          id: '$S{id}'
        }
      }
    });
    await pactum.spec()
      .post('http://localhost:9393/api/stores/duplicate')
      .withJson({
        id: 10
      })
      .expectJson({
        id: 10
      });
    await pactum.spec()
      .post('http://localhost:9393/api/stores/duplicate')
      .withJson({
        id: 20
      })
      .expectJson({
        id: 20
      });
    mock.removeInteraction('stores-duplicate');
  });

});