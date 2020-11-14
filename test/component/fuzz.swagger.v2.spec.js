const expect = require('chai').expect;
const pactum = require('../../src/index');

describe('Fuzz', () => {

  before(() => {
    pactum.mock.addMockInteraction({
      withRequest: {
        method: 'GET',
        path: '/swagger.json'
      },
      willRespondWith: {
        status: 200,
        body: {
          "swagger": "2.0",
          "basePath": "/v2",
          "paths": {
            "/health": {
              "get": {}
            },
            "/info": {
              "post": {}
            },
            "/version": {
              "put": {}
            }
          }
        }
      }
    });
  });

  it('swagger', async () => {
    await pactum.fuzz()
      .onSwagger('http://localhost:9393/swagger.json');
  });

  it('swagger - with batch size & inspect', async () => {
    await pactum.fuzz()
      .onSwagger('http://localhost:9393/swagger.json')
      .withBatchSize(5)
      .inspect();
  });

  it('swagger - fail for success status', async () => {
    pactum.mock.addMockInteraction({
      withRequest: {
        method: 'DELETE',
        path: '/v2/version'
      },
      willRespondWith: {
        status: 200
      }
    });
    let err;
    try {
      await pactum.fuzz()
        .onSwagger('http://localhost:9393/swagger.json');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined; 
  });

  after(() => {
    pactum.mock.clearInteractions();
  });

});