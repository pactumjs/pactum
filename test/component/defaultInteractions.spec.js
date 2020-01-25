const pactum = require('../../src/index');

describe('Pact - Default Interaction', () => {

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
      .toss()
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
      .toss()
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
      .toss()
  });

  after(() => {
    pactum.mock.removeDefaultInteractions();
  })

});