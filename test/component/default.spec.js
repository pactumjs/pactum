const expect = require('chai').expect;
const pactum = require('../../src/index');
const mock = require('../../src/exports/mock');
const config = require('../../src/config');

describe('Pact - Default Mock Interaction', () => {

  before(() => {
    mock.addMockInteraction({
      id: 'GET_FIRST_PROJECT',
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
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
    });
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/projects/2',
        query: {
          id: 2,
          name: 'fake'
        }
      },
      willRespondWith: {
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
      post: '/api/projects',
      return: {
        message: 'ok'
      }
    });
  });

  it('GET - one interaction', async () => {
    expect(mock.getInteractionCallCount('GET_FIRST_PROJECT')).equals(0, 'interaction should be called once');
    expect(mock.isInteractionExercised('GET_FIRST_PROJECT')).equals(false, 'interaction should not be exercised');
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      });
    expect(mock.getInteractionCallCount('GET_FIRST_PROJECT')).equals(1, 'interaction should be called once');
    expect(mock.isInteractionExercised('GET_FIRST_PROJECT')).equals(true, 'interaction should be exercised');
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
    expect(mock.getInteractionCallCount('GET_FIRST_PROJECT')).equals(2, 'interaction should be called twice');
    expect(mock.isInteractionExercised('GET_FIRST_PROJECT')).equals(true, 'interaction should be exercised');

  });

  it('GET - one interaction - with multiple queries', async () => {
    await pactum
      .get('http://localhost:9393/api/projects/2')
      .withQueryParam('id', 2)
      .withQueryParam('name', 'fake')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'bake'
      })
      .toss();
  });

  it('POST - one interaction - with ignore body', async () => {
    await pactum
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
    await pactum
      .useMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
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
    await pactum
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

describe('Pact - Default Pact Interaction', () => {

  before(() => {
    mock.addPactInteraction({
      id: 'GET_FIRST_PROJECT',
      provider: 'p',
      state: 'when there is a project with id 1',
      uponReceiving: 'a request for project 1',
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
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
    });
    mock.addPactInteraction({
      provider: 'p',
      state: 'when there is a project with id 1',
      uponReceiving: 'a request for project 1',
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {
          id: 1,
          name: 'fake'
        }
      },
      willRespondWith: {
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
  });

  it('GET - one interaction', async () => {
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
    expect(mock.getInteractionCallCount('GET_FIRST_PROJECT')).equals(1, 'interaction should be called once');
    expect(mock.isInteractionExercised('GET_FIRST_PROJECT')).equals(true, 'interaction should be exercised');
  });

  it('GET - one interaction - with multiple queries', async () => {
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .withQueryParam('id', 1)
      .withQueryParam('name', 'fake')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'bake'
      })
      .toss();
  });

  after(() => {
    mock.clearInteractions();
  });

});

describe('Pact - Default Mock Interactions', () => {

  before(() => {
    mock.addMockInteractions([
      {
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
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
      }
    ]);
    mock.addMockInteractions([{
      withRequest: {
        method: 'GET',
        path: '/api/projects/1',
        query: {
          id: 1,
          name: 'fake'
        }
      },
      willRespondWith: {
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
    mock.addInteractions([{
      post: '/api/projects',
      return: {
        message: 'ok'
      }
    }])
  });

  it('GET - one interaction', async () => {
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - with multiple queries', async () => {
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .withQueryParam('id', 1)
      .withQueryParam('name', 'fake')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'bake'
      })
      .toss();
  });

  it('POST - one interaction - with ignore body', async () => {
    await pactum
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

describe('Pact - Default Pact Interactions', () => {

  before(() => {
    mock.addPactInteractions([
      {
        provider: 'p',
        state: 'when there is a project with id 1',
        uponReceiving: 'a request for project 1',
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
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
      }
    ]);
    mock.addPactInteractions([
      {
        provider: 'p',
        state: 'when there is a project with id 1',
        uponReceiving: 'a request for project 1',
        withRequest: {
          method: 'GET',
          path: '/api/projects/1',
          query: {
            id: 1,
            name: 'fake'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            id: 1,
            name: 'bake'
          }
        }
      }
    ]);
  });

  it('GET - one interaction', async () => {
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('GET - one interaction - with multiple queries', async () => {
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .withQueryParam('id', 1)
      .withQueryParam('name', 'fake')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'bake'
      })
      .toss();
  });

  after(() => {
    mock.clearInteractions();
  });

});

describe('Pact - Defaults', () => {

  it('request - setBaseUrl', async () => {
    pactum.request.setBaseUrl('http://localhost:9393');
    await pactum
      .get('/api')
      .expectStatus(404);
  });

  it('request - setDefaultTimeout', async () => {
    pactum.request.setDefaultTimeout(2000);
    await pactum
      .get('http://localhost:9393/api')
      .expectStatus(404);
  });

  it('request - setDefaultHeader', async () => {
    pactum.request.setDefaultHeader('content-type', 'application/json');
    await pactum
      .get('http://localhost:9393/api')
      .expectStatus(404);
  });

  it('settings - setLogLevel', async () => {
    pactum.settings.setLogLevel('INFO');
    await pactum
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
    mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/api/projects/1'
      },
      willRespondWith: {
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
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(200)
      .toss();
  });

  it('GET - Call - 1', async () => {
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(201)
      .toss();
  });

  it('GET - Call - 2', async () => {
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(202)
      .toss();
  });

  it('GET - Call - 3', async () => {
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(204)
      .toss();
  });

  it('GET - Call - 4', async () => {
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(204)
      .toss();
  });

  it('GET - Call - 5', async () => {
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .expectStatus(500)
      .toss();
  });

});