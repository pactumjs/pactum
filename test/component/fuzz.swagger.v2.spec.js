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
              "get": {}
            },
            "/version": {
              "get": {}
            }
          }
        }
      }
    });
  });

  it('swagger', async () => {
    await pactum.fuzz()
      .swagger('http://localhost:9393/swagger.json');
  });

  after(() => {
    pactum.mock.clearInteractions();
  });

});