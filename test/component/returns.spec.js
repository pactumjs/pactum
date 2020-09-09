const pactum = require('../../src/index');
const expect = require('chai').expect;

describe('Returns', () => {

  it('default return value', async () => {
    const response = await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/users'
        },
        willRespondWith: {
          status: 200,
          body: {
            id: 1
          }
        }
      })
      .get('http://localhost:9393/api/users')
      .expectStatus(200);
    expect(response.statusCode).equals(200);
    expect(response.json).deep.equals({ id: 1 });
  });

  it('custom return function', async () => {
    const response = await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/users'
        },
        willRespondWith: {
          status: 200,
          body: {
            id: 1
          }
        }
      })
      .get('http://localhost:9393/api/users')
      .expectStatus(200)
      .returns((_, resp) => resp.json.id);
    expect(response).equals(1);
  });

  it('return with json query', async () => {
    const response = await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/users'
        },
        willRespondWith: {
          status: 200,
          body: {
            id: 1
          }
        }
      })
      .get('http://localhost:9393/api/users')
      .expectStatus(200)
      .returns('id');
    expect(response).equals(1);
  });

  it('return with custom handler function', async () => {
    pactum.handler.addReturnHandler('GetID', ({ res }) => res.json.id);
    const response = await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/users'
        },
        willRespondWith: {
          status: 200,
          body: {
            id: 1
          }
        }
      })
      .get('http://localhost:9393/api/users')
      .expectStatus(200)
      .returns('GetID');
    expect(response).equals(1);
  });

  it('multiple returns', async () => {
    pactum.handler.addReturnHandler('GetID', ({ res }) => res.json.id);
    const response = await pactum
      .addMockInteraction({
        withRequest: {
          method: 'GET',
          path: '/api/users'
        },
        willRespondWith: {
          status: 200,
          body: {
            id: 1
          }
        }
      })
      .get('http://localhost:9393/api/users')
      .expectStatus(200)
      .returns('id')
      .returns('GetID');
    expect(response).deep.equals([1, 1]);
  });


});