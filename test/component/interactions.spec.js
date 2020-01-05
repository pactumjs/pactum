const pactum = require('../../src/index');


describe('Pact', () => {

  before(async () => {
    await pactum.mock.start();
  });

  it('GET - one interaction', async () => {
    await pactum
      .addInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
        }
      })
      .get('http://localhost:3000/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss()
  });

  it('GET - one interaction - with one query', async () => {
    await pactum
      .addInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/projects/1',
          query: {
            name: 'fake'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
        }
      })
      .get('http://localhost:3000/api/projects/1')
      .withQuery('name', 'fake')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss()
  });

  it('GET - one interaction - with multiple queries', async () => {
    await pactum
      .addInteraction({
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
            'Content-Type': 'application/json'
          },
          body: {
            id: 1,
            name: 'fake'
          }
        }
      })
      .get('http://localhost:3000/api/projects/1')
      .withQuery('id', 1)
      .withQuery('name', 'fake')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake'
      })
      .toss()
  });

  after(async () => {
    await pactum.mock.stop();
  })

});