const expect = require('chai').expect;
const pactum = require('../../src/index');
const mock = require('../../src/exports/mock');
const config = require('../../src/config');

describe('Mock - Default Mock Interaction', () => {

  before(() => {
    mock.addInteraction({
      id: 'GET_FIRST_PROJECT',
      request: {
        method: 'GET',
        path: '/api/projects/1'
      },
      response: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'fake'
        }
      }
    });
    mock.addInteraction({
      request: {
        method: 'GET',
        path: '/api/projects/2',
        queryParams: {
          id: 2,
          name: 'fake'
        }
      },
      response: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'bake'
        }
      }
    });
    mock.addInteraction({
      strict: false,
      request: {
        method: 'POST',
        path: '/api/projects'
      },
      response: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          message: 'ok'
        }
      }
    });
  });

  it('GET - one interaction', async () => {
    expect(mock.getInteraction('GET_FIRST_PROJECT').callCount).equals(0, 'interaction should not be called');
    expect(mock.getInteraction('GET_FIRST_PROJECT').exercised).equals(false, 'interaction should not be exercised');
    await pactum.spec()
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      });
    expect(mock.getInteraction('GET_FIRST_PROJECT').callCount).equals(1, 'interaction should be called once');
    expect(mock.getInteraction('GET_FIRST_PROJECT').exercised).equals(true, 'interaction should be exercised');
    await pactum.spec()
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200);
    expect(mock.getInteraction('GET_FIRST_PROJECT').callCount).equals(2, 'interaction should be called twice');
    expect(mock.getInteraction('GET_FIRST_PROJECT').exercised).equals(true, 'interaction should be exercised');

  });

  it('GET - one interaction - with multiple queries', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/projects/2')
      .withQueryParams('id', 2)
      .withQueryParams('name', 'fake')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'bake'
      })
      .toss();
  });

  it('POST - one interaction - with ignore body', async () => {
    await pactum.spec()
      .post('http://localhost:9393/api/projects')
      .withJson({
        id: 1,
        title: 'new fake'
      })
      .expectStatus(200)
      .expectJson({
        message: 'ok'
      })
      .toss();
  });

  it('GET - one interaction - overwrite default', async () => {
    await pactum.spec()
      .useInteraction({
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 3,
            name: 'overwrite'
          }
        }
      })
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 3,
        name: 'overwrite'
      })
      .toss();
  });

  it('GET - one interaction - get default interaction', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  after(() => {
    mock.clearInteractions();
  });

});

describe('Mock - Default Mock Interactions', () => {

  before(() => {
    mock.addInteraction([
      {
        request: {
          method: 'GET',
          path: '/api/projects/1'
        },
        response: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
        }
      }
    ]);
    mock.addInteraction([{
      request: {
        method: 'GET',
        path: '/api/projects/1',
        queryParams: {
          id: 1,
          name: 'fake'
        }
      },
      response: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          id: 1,
          name: 'bake'
        }
      }
    }]);
    mock.addInteraction([{
      strict: false,
      request: {
        method: 'POST',
        path: '/api/projects'
      },
      response: {
        status: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          message: 'ok'
        }
      }
    }]);
  });

  it('GET - one interaction', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - with multiple queries', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/projects/1')
      .withQueryParams('id', 1)
      .withQueryParams('name', 'fake')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'bake'
      })
      .toss();
  });

  it('POST - one interaction - with ignore body', async () => {
    await pactum.spec()
      .post('http://localhost:9393/api/projects')
      .withJson({
        id: 1,
        title: 'new fake'
      })
      .expectStatus(200)
      .expectJson({
        message: 'ok'
      })
      .toss();
  });

  after(() => {
    mock.clearInteractions();
  });

});

describe('Mock - Defaults', () => {

  it('request - setBaseUrl', async () => {
    pactum.request.setBaseUrl('http://localhost:9393');
    await pactum.spec()
      .get('/api')
      .expectStatus(404);
  });

  it('request - setDefaultTimeout', async () => {
    pactum.request.setDefaultTimeout(2000);
    await pactum.spec()
      .get('http://localhost:9393/api')
      .expectStatus(404);
  });

  it('request - setDefaultHeader', async () => {
    pactum.request.setDefaultHeaders('content-type', 'application/json');
    await pactum.spec()
      .get('http://localhost:9393/api')
      .expectStatus(404);
  });

  it('settings - setLogLevel', async () => {
    pactum.settings.setLogLevel('INFO');
    await pactum.spec()
      .get('http://localhost:9393/api')
      .expectStatus(404);
  });

  afterEach(() => {
    pactum.request.setBaseUrl('');
    pactum.request.setDefaultTimeout(3000);
    config.request.headers = {};
  });

});

describe('OnCall - Mock Interactions', () => {

  before(() => {
    mock.addInteraction({
      request: {
        method: 'GET',
        path: '/api/projects/1'
      },
      response: {
        status: 204,
        onCall: {
          0: {
            status: 200
          },
          "1": {
            status: 201
          },
          2: {
            status: 202
          },
          5: {
            status: 500
          }
        }
      }
    });
  });

  it('GET - Call - 0', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
      .toss();
  });

  it('GET - Call - 1', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(201)
      .toss();
  });

  it('GET - Call - 2', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(202)
      .toss();
  });

  it('GET - Call - 3', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(204)
      .toss();
  });

  it('GET - Call - 4', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(204)
      .toss();
  });

  it('GET - Call - 5', async () => {
    await pactum.spec()
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(500)
      .toss();
  });

});