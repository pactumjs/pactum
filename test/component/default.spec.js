const pactum = require('../../src/index');
const config = require('../../src/config');

describe('Pact - Default Mock Interaction', () => {

  before(() => {
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
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
    pactum.mock.addDefaultMockInteraction({
      withRequest: {
        method: 'POST',
        path: '/api/projects',
        ignoreBody: true
      },
      willRespondWith: {
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
      .get('http://localhost:9393/api/projects/2')
      .withQuery('id', 2)
      .withQuery('name', 'fake')
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
      .addMockInteraction({
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
    pactum.mock.clearDefaultInteractions();
  });

});

describe('Pact - Default Pact Interaction', () => {

  before(() => {
    pactum.mock.addDefaultPactInteraction({
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
    pactum.mock.addDefaultPactInteraction({
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
  });

  it('GET - one interaction - with multiple queries', async () => {
    await pactum
      .get('http://localhost:9393/api/projects/1')
      .withQuery('id', 1)
      .withQuery('name', 'fake')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'bake'
      })
      .toss();
  });

  after(() => {
    pactum.mock.clearDefaultInteractions();
  });

});

describe('Pact - Default Mock Interactions', () => {

  before(() => {
    pactum.mock.addDefaultMockInteractions([
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
      },
      {
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
      },
      {
        withRequest: {
          method: 'POST',
          path: '/api/projects',
          ignoreBody: true
        },
        willRespondWith: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          },
          body: {
            message: 'ok'
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
      .withQuery('id', 1)
      .withQuery('name', 'fake')
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
    pactum.mock.clearDefaultInteractions();
  });

});

describe('Pact - Default Pact Interactions', () => {

  before(() => {
    pactum.mock.addDefaultPactInteractions([
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
      },
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
      .withQuery('id', 1)
      .withQuery('name', 'fake')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'bake'
      })
      .toss();
  });

  after(() => {
    pactum.mock.clearDefaultInteractions();
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