const pactum = require('../../src/index');

describe('Remote- post single mock interaction', () => {

  let id;

  before(async () => {
    pactum.mock.clearDefaultInteractions();
    id = await pactum
      .post('http://localhost:9393/api/pactum/mockInteraction')
      .withJson([{
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
      }])
      .expectStatus(200)
      .expectJsonLike([/\w+/])
      .returns('[0]');
  });

  it('get all mock interactions', async () => {
    await pactum
      .get('http://localhost:9393/api/pactum/mockInteraction')
      .expectStatus(200)
      .expectJson([{
        willRespondWith: {
          body: {
            id: 1,
            name: 'fake'
          },
          headers: {
            'content-type': 'application/json'
          },
          status: 200
        },
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        }
      }])
      .toss();
  });

  it('get single mock interaction', async () => {
    await pactum
      .get(`http://localhost:9393/api/pactum/mockInteraction?id=${id}`)
      .expectStatus(200)
      .expectJson([{
        willRespondWith: {
          body: {
            id: 1,
            name: 'fake'
          },
          headers: {
            'content-type': 'application/json'
          },
          status: 200
        },
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        }
      }])
      .toss();
  });

  it('exercise single mock interaction', async () => {
    await pactum
      .get(`http://localhost:9393/api/projects/1`)
      .expectStatus(200)
      .expectJson({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  after(async () => {
    await pactum
      .delete(`http://localhost:9393/api/pactum/mockInteraction?id=${id}`)
      .expectStatus(200)
      .toss();
  });

});

describe('Remote- post single pact interaction', () => {

  let id;

  before(async () => {
    id = await pactum
      .post('http://localhost:9393/api/pactum/pactInteraction')
      .withJson([{
        provider: 'big',
        state: 'liquid',
        uponReceiving: 'vapour',
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
      }])
      .expectStatus(200)
      .expectJsonLike([/\w+/])
      .returns('[0]');
  });

  it('get all mock interactions', async () => {
    await pactum
      .get('http://localhost:9393/api/pactum/pactInteraction')
      .expectStatus(200)
      .expectJson([{
        provider: 'big',
        state: 'liquid',
        uponReceiving: 'vapour',
        willRespondWith: {
          body: {
            id: 1,
            name: 'fake'
          },
          headers: {
            'content-type': 'application/json'
          },
          status: 200
        },
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        }
      }])
      .toss();
  });

  it('get single mock interaction', async () => {
    await pactum
      .get(`http://localhost:9393/api/pactum/pactInteraction?id=${id}`)
      .expectStatus(200)
      .expectJson([{
        provider: 'big',
        state: 'liquid',
        uponReceiving: 'vapour',
        willRespondWith: {
          body: {
            id: 1,
            name: 'fake'
          },
          headers: {
            'content-type': 'application/json'
          },
          status: 200
        },
        withRequest: {
          method: 'GET',
          path: '/api/projects/1'
        }
      }])
      .toss();
  });

  it('exercise single mock interaction', async () => {
    await pactum
      .get(`http://localhost:9393/api/projects/1`)
      .expectStatus(200)
      .expectJson({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  it('exercise single mock interaction - second iteration', async () => {
    await pactum
      .get(`http://localhost:9393/api/projects/1`)
      .expectStatus(200)
      .expectJson({
        id: 1,
        name: 'fake'
      })
      .toss();
  });

  after(async () => {
    await pactum
      .delete(`http://localhost:9393/api/pactum/pactInteraction?id=${id}`)
      .expectStatus(200)
      .toss();
  });

});

describe('Remote- invalid requests', () => {

  it('invalid url', async () => {
    await pactum
      .get('http://localhost:9393/api/pactum/invalid')
      .expectStatus(404)
      .expectBodyContains('404 Not Found')
      .toss();
  });

  it('invalid method', async () => {
    await pactum
      .patch('http://localhost:9393/api/pactum/mockInteraction')
      .expectStatus(405)
      .toss();
  });

});