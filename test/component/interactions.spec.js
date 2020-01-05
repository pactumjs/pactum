const pactum = require('../../src/index');
const { like, term, eachLike } = pactum.matchers;


describe('Pact', () => {

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

});

describe('Pact - matchers', () => {

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
            id: like(1),
            name: like('fake'),
            gender: term({ matcher: 'F|M', generate: 'M' }),
            married: like(true),
            favorite: {
              books: eachLike('Harry Porter')
            },
            addresses: eachLike({ street: like('Road No. 60')})
          }
        }
      })
      .get('http://localhost:3000/api/projects/1')
      .expectStatus(200)
      .expectJsonLike({
        id: 1,
        name: 'fake',
        gender: 'M',
        married: true,
        favorite: {
          books: [ 'Harry Porter' ]
        },
        addresses: [
          {
            street: 'Road No. 60'
          }
        ]
      })
      .toss()
  });

});