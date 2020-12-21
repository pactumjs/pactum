const expect = require('chai').expect;
const pactum = require('../../src/index');
const { mock, handler } = pactum;

describe('Fuzz', () => {

  before(() => {
    pactum.settings.setLogLevel('ERROR');
    mock.addMockInteraction({
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
              "put": {
                "parameters": [
                  {
                    "in": "body",
                    "schema": {
                      "$ref": "#/definitions/Version"
                    }
                  }
                ]
              }
            }
          },
          "definitions": {
            "Version": {
              "type": "object",
              "properties": {
                "major": {
                  "type": "string"
                },
                "minor": {
                  "type": "string"
                },
                "patch": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    });
    handler.addMockInteractionHandler('root invalid path', (ctx) => {
      return {
        withRequest: {
          method: ctx.data,
          path: '/ROOT/INVALID/PATH'
        },
        willRespondWith: {
          status: 404
        }
      };
    });
    handler.addMockInteractionHandler('invalid path', (ctx) => {
      return {
        withRequest: {
          method: ctx.data.method,
          path: ctx.data.path
        },
        willRespondWith: {
          status: 404
        }
      };
    });
    handler.addMockInteractionHandler('invalid method', (ctx) => {
      return {
        withRequest: {
          method: ctx.data.method,
          path: ctx.data.path
        },
        willRespondWith: {
          status: 405
        }
      };
    });
    mock.addMockInteraction('root invalid path', 'GET');
    mock.addMockInteraction('root invalid path', 'POST');
    mock.addMockInteraction('root invalid path', 'DELETE');
    mock.addMockInteraction('root invalid path', 'PUT');
    mock.addMockInteraction('root invalid path', 'PATCH');
    mock.addMockInteraction('invalid path', { method: 'GET', path: '/v2/health/INVALID/PATH' });
    mock.addMockInteraction('invalid path', { method: 'POST', path: '/v2/info/INVALID/PATH' });
    mock.addMockInteraction('invalid path', { method: 'PUT', path: '/v2/version/INVALID/PATH' });
    mock.addMockInteraction('invalid method', { method: 'POST', path: '/v2/health' });
    mock.addMockInteraction('invalid method', { method: 'PUT', path: '/v2/health' });
    mock.addMockInteraction('invalid method', { method: 'PATCH', path: '/v2/health' });
    mock.addMockInteraction('invalid method', { method: 'DELETE', path: '/v2/health' });
    mock.addMockInteraction('invalid method', { method: 'GET', path: '/v2/info' });
    mock.addMockInteraction('invalid method', { method: 'PUT', path: '/v2/info' });
    mock.addMockInteraction('invalid method', { method: 'PATCH', path: '/v2/info' });
    mock.addMockInteraction('invalid method', { method: 'DELETE', path: '/v2/info' });
    mock.addMockInteraction('invalid method', { method: 'GET', path: '/v2/version' });
    mock.addMockInteraction('invalid method', { method: 'POST', path: '/v2/version' });
    mock.addMockInteraction('invalid method', { method: 'PATCH', path: '/v2/version' });
    mock.addMockInteraction('invalid method', { method: 'DELETE', path: '/v2/version' });
    mock.addMockInteraction({
      withRequest: {
        method: 'PUT',
        path: '/v2/version'
      },
      willRespondWith: {
        status: 400
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
    let err;
    try {
      await pactum.fuzz()
        .useMockInteraction({
          withRequest: {
            method: 'DELETE',
            path: '/v2/version'
          },
          willRespondWith: {
            status: 200
          }
        })
        .onSwagger('http://localhost:9393/swagger.json');
    } catch (error) {
      err = error;
    }
    expect(err).not.undefined;
    expect(err.toString()).includes('Fuzz');
  });

  after(() => {
    pactum.settings.setLogLevel('INFO');
    pactum.mock.clearInteractions();
  });

});